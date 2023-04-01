import time
import json
from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets
from .serializers import WorkShareSerializer
from .models import WorkShare
from .models import Profile, Post, JobListing, Comment, Recommendations, Connection, Document
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer, RecommendationsSerializer, ConnectionSerializer, DocumentSerializer
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.contrib import messages
from django.db.models import Q
import datetime

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status
from django.contrib.auth.tokens import PasswordResetTokenGenerator

#for email confirmation
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from .tokens import account_activation_token

class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        
        serializer = UserSerializerWithToken(self.user).data

        for k, v in serializer.items():
            data[k] = v
        
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


class WorkShareView(viewsets.ModelViewSet):
    serializer_class = WorkShareSerializer
    queryset = WorkShare.objects.all()
    
    
    
class ProfileView(APIView):
    def get(self, request, pk):
        profile = get_object_or_404(Profile, pk=pk)
        serializer = ProfileSerializer(profile)
        return Response(serializer.data)
    
    

class ProfileCreateView(CreateAPIView):
    queryset = Profile.objects.all()
    serializer_class = ProfileSerializer
    

@api_view(['PUT'])
def changePassword(request, pk):
    """
    API endpoint for changing a user's password.

    Args:
        request (HttpRequest): The HTTP request object.
        pk (int): The primary key of the user to change the password for.

    Returns:
        Response: An HTTP response object containing the serialized data of the user with the updated password.
    """
    data = request.data
    try:
        user = get_object_or_404(User, pk=pk)

        if user.check_password(data['oldPassword']):
            user.set_password(data['newPassword'])
        else:
            return Response(status=status.HTTP_400_BAD_REQUEST)
            
        user.save()

        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def changePasswordForReset(request, pk):
    """
    View to handle password reset requests.
    
    Parameters:
    - request: HTTP request object.
    - pk (int): Primary key of the user whose password is being reset.

    Returns:
    - Response: HTTP response object with a status code of 200 if the password is reset successfully,
                or a status code of 400 if there is an error.
    """
    data = request.data
    try:
        user = get_object_or_404(User, pk=pk)

        # Set the user's password to the new password provided in the request data
        user.set_password(data['newPassword']) 
        user.save()

        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)
    

@api_view(['PUT'])
def password_reset_request(request):
    """
    A view to handle password reset requests by sending a password reset email
    to the user's email address.
    
    Parameters:
    - request (Request): The HTTP request object.
    
    Returns:
    - Response: A JSON response object with serialized user data if the request is successful,
                or a JSON response object with an error message if the request fails.
    """
    data = request.data
    try: 
        # Get the user's email from the data
        user_email = data.get('email')
        User = get_user_model()

        try:
            # Try to get the user with the provided email
            user = User.objects.get(email=user_email)
        except User.DoesNotExist:
            return None
        serializer = UserSerializerWithToken(user, many=False)

        # Send a password reset email to the user
        passwordResetEmail(request, user, user_email)

        return Response(serializer.data)
    except: 
        message = {'detail':'A problem occurred while sending the email. Please make sure you have entered the correct email and try again.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


def passwordResetEmail(request, user, user_email):
    """
    This function sends a password reset email to the given user's email address.

    Parameters:
    - request (HttpRequest): The HTTP request object.
    - user (User): The user whose password needs to be reset.
    - user_email (str): The email address of the user.

    Returns:
    - If the email is sent successfully, returns a Response object with status code 200 and 
      a message 'Email sent successfully'.
    - If there is an error sending the email, returns a Response object with status code 400  
      and a message 'A problem occurred while sending the email. Please make sure you have entered 
      the correct email and try again.'
    """
    
    mail_subject = 'Password Reset Request - Automated message. Please do not reply.'
    token_generator = PasswordResetTokenGenerator()
    token = token_generator.make_token(user)
    user.save()
    message = render_to_string('reset_password_template.html', {
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': token,
        'protocol': 'https'
    })
    email = EmailMessage(mail_subject, message, to=[user_email])
    if email.send():
        print('Email sent successfully')
        message = {'detail':'Email sent successfully'}
        return Response(message, status=status.HTTP_200_OK)
    else:
        message = {'detail':'A problem occurred while sending the email. Please make sure you have entered the correct email and try again.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
def passwordResetConfirm(request, uidb64, token):
    """
    A view function that confirms the validity of a password reset link by checking if the
    UID and token are valid. If the UID and token are valid, the user is redirected to the
    password reset form. Otherwise, an error response is returned.

    Args:
    - request: The HTTP request object.
    - uidb64: The UID encoded in base64 format.
    - token: The password reset token.

    Returns:
    - If the UID and token are valid, the function returns an HTTP redirect response to
      the password reset form.
    - If the UID and token are invalid, the function returns an HTTP error response with a
      status code of 400 and a message indicating that the password reset link is invalid
      or has expired.
    """

    try:
        #Decode uid
        uid = urlsafe_base64_decode(uidb64).decode()
        user = User.objects.get(pk=uid)
        token_generator = PasswordResetTokenGenerator()

        if user is not None and token_generator.check_token(user, token):
            # If the token is valid, redirect the user to the password reset form
            ###CHANGE THIS PATH ONCE HOSTED
            reset_url = f'http://localhost:3000/password_reset_form/{uidb64}/{token}'
            return redirect(reset_url)
        else:
            message = {'detail':'The password reset link is invalid or has expired. Please request a new link.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)
    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        message = {'detail':'The password reset link is invalid or has expired. Please request a new link.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)


# TO-DO: finalize implementation of user authentication
@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
# This function is intended to allow the user to update their profile 
def updateUserProfile(request, pk):
    profile = get_object_or_404(Profile, pk=pk)

    data = request.data

    profile.name = data['name']
    profile.city = data['city']
    profile.title = data['title']
    profile.about = data['about']
    profile.experience = data['experience']
    profile.education = data['education']
    profile.work = data['work']
    profile.volunteering = data['volunteering']
    profile.courses = data['courses']
    profile.projects = data['projects']
    profile.awards = data['awards']
    profile.languages = data['languages']

    profile.save()

    serializer = ProfileSerializerWithToken(profile, many=False)

    return Response(serializer.data)
    
# This function is intended to allow the user to update an existing post that they posted
@api_view(['PUT'])    
def PostUpdateView(request, pk):
    post = get_object_or_404(Post, pk=pk)

    data = request.data

    post.title = data['title']
    post.content = data['content']

    post.save()

    serializer = PostSerializer(post, many=False)

    return Response(serializer.data)

# This function is intended to allow the user to delete an existing post that they created
@api_view(['DELETE', 'GET'])
def PostDeleteView(request, pk):
    post = Post.objects.get(id=pk)
    post.delete()
    return Response('Post Deleted')

# This function is intended to allow the user to update an existing job post that they created
@api_view(['PUT'])
def JobListingUpdateView(request, pk):
    """
    A view to handle an update of an existing job listing.

    Parameters:
    - request: HTTP request object.
    - pk (int): Primary key of the JobListing object that is being updated.

    Returns:
    - Response: HTTP response object with serialized job listing data.
    """
    data = request.data
    
    job = get_object_or_404(JobListing, pk=pk)

    try:
        if data['status'] == "true":
            status = True
        else:
            status = False
    except:
        status = True
        
    
    if data['remote'] == "true":
        remote = True
    else:
        remote = False

    docs_data = {k: v for k, v in data.items() if k.startswith('required_docs')}
    
    docs_dict = {}

    for key, value in docs_data.items():
        if key.endswith('[type]'):
            req_key = str(key).removesuffix('[type]') + '[required]'
            
            if docs_data[req_key] == 'true':
                docs_dict[docs_data[key]] = True
            else:
                docs_dict[docs_data[key]] = False

    job.title = data['title']
    job.description = data['description']
    job.remote = remote
    job.company = data['company']
    job.location = data['location']
    job.status = status
    job.deadline = data['deadline']
    job.salary = data['salary']
    job.salary_type = data['salary_type']
    job.listing_type = data['listing_type']
    job.link = data['link']
    job.employment_term = data['employment_term']
    job.job_type = data['job_type']

    job.save()

    for doc, req in docs_dict.items():
        document = Document.objects.get(document_type=doc)
        if req is True and job.required_docs:
            job.required_docs.add(document)
            job.save()
        else:
            job.required_docs.remove(document)
    
    for doc, req in docs_dict.items():
        if req is True: 
            document = Document.objects.all().filter(document_type=doc)
            if not document.exists():
                document = Document(document_type=doc)
                document.save()
                job.required_docs.add(document)
                job.save()
            else:
                document = Document.objects.get(document_type=doc)
                job.required_docs.add(document)
                job.save()
        if req is False: 
            document = Document.objects.all().filter(document_type=doc)
            if document.exists():
                document = Document.objects.get(document_type=doc)
                job.required_docs.remove(document)

    serializer = JobListingSerializer(job, many=False)

    return Response(serializer.data)

# This function is intended to allow the user to delete an existing job post that they created
@api_view(['DELETE', 'GET'])
def JobListingDeleteView(request, pk):
    """
    A view to handle deletion of an existing job listing.

    Parameters:
    - request: HTTP request object.
    - pk (int): Primary key of the JobListing object that is to be deleted.

    Returns:
    - Response: HTTP response object with a status code of 200 if the JobListing is deleted succesfully,
                or a status code of 400 if there is an error.
    """
    try:
        job = get_object_or_404(JobListing, pk=pk)
        job.delete()
        return Response(status=status.HTTP_200_OK)
    except:
        return Response(status=status.HTTP_400_BAD_REQUEST)

class PostView(APIView):
    def get(self, request, pk):
        post = get_object_or_404(Post, pk=pk)
        serializer = PostSerializer(post)
        return Response(serializer.data)
    
class PostCreateView(CreateAPIView):
    queryset = Post.objects.all()
    serializer_class = PostSerializer
    
class PostLatestView(APIView):
    def get(self, request):
        posts = Post.objects.all().order_by('-created_at')[:10]
        post_list = []
        for post in posts:
            image_path = ""
            if post.image and hasattr(post.image, 'url'):
                image_path = post.image.url

            post_list.append({
                'id': post.id,
                'author': post.author.username,
                'title': post.title,
                'content': post.content,
                'image': image_path,
                'likes': post.likes,
                'created_at': post.created_at
            })
        return JsonResponse(post_list, safe=False)

class UserPostsView(APIView):
    def get(self, request, pk):
        posts = Post.objects.all().filter(author__id = pk).order_by('-created_at')[:10]
        post_list = []
        for post in posts:
            image_path = ""
            if post.image and hasattr(post.image, 'url'):
                image_path = post.image.url
            post_list.append({
                'id': post.id,
                'author': post.author.username,
                'title': post.title,
                'content': post.content,
                'image': image_path,
                'likes': post.likes,
                'created_at': post.created_at
            })
        return JsonResponse(post_list, safe=False)

class PostListingCreateView(CreateAPIView):
     queryset = Post.objects.all()
     serializer_class = PostSerializer

     def create(self, validated_data):
        print(self)
        request = self.request 
        
        print(request)
        
        user = User.objects.get(email=request.data['author'])
        post = Post.objects.create(
            author=user,
            title=request.data['title'],
            content=request.data['content'],
            image=request.data['image'],
        )
        post.save()
        
        return Response(status=status.HTTP_200_OK)


class JobListingCreateView(CreateAPIView): 
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer

    def create(self, validated_data):
        """
        A view to handle the creation of a new job listing.

        Returns:
        - Response: An HTTP response object with serialized JobListing data if the request is successful,
                    or an HTTP response object with an error message if the request fails.
        """
        try:
            request = self.request 
            
            data = request.data

            try:
                if data['status'] == "true":
                    stat = True
                else:
                    stat = False
            except:
                stat = True
                
            
            if data['remote'] == "true":
                remote_ = True
            else:
                remote_ = False

            if data['salary'] == '':
                salary = 0
            else:
                salary = data['salary']

            docs_data = {k: v for k, v in data.items() if k.startswith('required_docs')}
            
            docs_dict = {}
            
            for key, value in docs_data.items():
                if key.endswith('[type]'):
                    req_key = str(key).removesuffix('[type]') + '[required]'
                    
                    if docs_data[req_key] == 'true':
                        docs_dict[docs_data[key]] = True
                    else:
                        docs_dict[docs_data[key]] = False

            job = JobListing.objects.create(
                author=User.objects.get(email=request.data['author']),
                title=request.data['title'],
                description=request.data['description'],
                image=request.data['image'],
                company = request.data['company'],
                location = request.data['location'],
                status = stat,
                remote = remote_,
                deadline = request.data['deadline'],
                salary=salary,
                salary_type = request.data['salary_type'],
                listing_type = request.data['listing_type'],
                link = request.data['link'],
                employment_term = request.data['employment_term'],
                job_type = request.data['job_type']
            )
            job.save()

            for doc, req in docs_dict.items():
                if req is True: 
                    document = Document.objects.all().filter(document_type=doc)
                    if not document.exists():
                        document = Document(document_type=doc)
                        document.save()
                        job.required_docs.add(document)
                        job.save()
                    else:
                        document = Document.objects.get(document_type=doc)
                        job.required_docs.add(document)
                        job.save()
                else:
                    document = Document.objects.all().filter(document_type=doc)
                    if not document.exists():
                        document = Document(document_type=doc)
                        document.save()

            serializer = JobListingSerializer(job, many=False)

            return Response(serializer.data, status=status.HTTP_200_OK)
        except:
            message = {'detail':'A problem occurred while creating this Job Listing. Please try again later.'}
            return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def JobListingView(request, pk):
    """
    A view to handle the retrieval of one Job Listing.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Job Listing to retrieve.

    Returns: 
    - Response: JSON Response with the Job Listing information.
    """
    job = get_object_or_404(JobListing, pk=pk)
    job_documents = []
    all_docs = Document.objects.all()

    if job.required_docs is not None:
        job_docs = list(job.required_docs.all())
        for doc in job_docs:
            s = {'type': doc.__str__(), 'required': 'true'}
            job_documents.append(s)
            
    for document in all_docs:
        if not any(pair['type'] == document.__str__() for pair in job_documents):
            s = {'type': document.__str__(), 'required': 'false'}
            job_documents.append(s)
    
    job_serializer = JobListingSerializer(job, many=False)
    doc_serializer = DocumentSerializer(job_documents, many=True)

    serializer_list = [job_serializer.data, doc_serializer.data]

    return Response(serializer_list)


class JobListingLatestView(APIView):
    def get(self, request):
        """
        A view to handle the retrieval of the Latest Job Listings.

        Parameters:
        - request: An HTTP request object.

        Returns:
        - Response: A JSON response object containing the list of latest Job Listings.
        """
        jobs = JobListing.objects.all().order_by('-created_at')[:10]
        all_docs = Document.objects.all()
        job_list = []

        for job in jobs:
            job_comments = []
            job_documents = []
            image_path = ""
            
            if job.required_docs is not None:
                job_docs = list(job.required_docs.all())
                for doc in job_docs:
                    s = {'type': doc.__str__(), 'required': 'true'}
                    job_documents.append(s)
            
            for document in all_docs:
                if not any(pair['type'] == document.__str__() for pair in job_documents):
                    s = {'type': document.__str__(), 'required': 'false'}
                    job_documents.append(s)

            doc_serializer = DocumentSerializer(job_documents, many=True)

            if job.comments is not None:
                job_comments.append({
                    'author': str(job.comments.author),
                    'content': job.comments.content,
                    'created_at': job.comments.created_at
                })
            else:
                job_comments=[]

            if job.image and hasattr(job.image, 'url'):
                image_path = job.image.url

            job_list.append({
                'id': job.id,
                'author': job.author.username,
                'title': job.title,
                'description': job.description,
                'image': image_path,
                'likes': job.likes,
                'created_at': job.created_at,
                'location': job.location,
                'status': job.status,
                'company': job.company,
                'comments': job_comments,
                'remote': job.remote,
                'deadline': job.deadline,
                'required_docs': doc_serializer.data,
                'salary': job.salary,
                'salary_type': job.salary_type,
                'listing_type': job.listing_type,
                'link': job.link,
                "employment_term": job.employment_term,
                "job_type": job.job_type
            })
        return JsonResponse(job_list, safe=False)

# This function is intended to allow us to get the user profile
@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)

# This function is intended allow us to get the recommendations related data (sent and received) of a given profile
@api_view(['GET'])
def getProfileView(request, pk):
    profile = get_object_or_404(Profile, pk=pk)
    profile_serializer = ProfileSerializer(profile)

    sent_recommendations = Recommendations.objects.filter(sender=profile)
    received_recommendations = Recommendations.objects.filter(recipient=profile)

    sent_recommendations_serializer = RecommendationsSerializer(sent_recommendations, many=True)
    received_recommendations_serializer = RecommendationsSerializer(received_recommendations, many=True)

    data = {
        "profile": profile_serializer.data,
        "sent_recommendations": sent_recommendations_serializer.data,
        "received_recommendations": received_recommendations_serializer.data
    }

    return Response(data)

# This function is intended to register a user
@api_view(['POST'])
def registerUser(request):
    data = request.data
    print(data, type(data))
    try: 
         user = User.objects.create(
              first_name= data['name'],
              username=data['username'],
              email=data['username'],
              password=make_password(data['password']),
              is_active=False
              )

         serializer = UserSerializerWithToken(user, many=False)
         print('user created!')
         activateEmail(request, user, str(user.email))
         return Response(serializer.data)
    except: 
         message = {'detail':'A problem occurred while registering this account. Make sure that the email entered is correct and that it does not belong to an existing user.'}
         return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
# This function allows the user to activate their user account
def activateEmail(request, user, to_email):
    mail_subject = 'Activate your user account. - Automated message. Please do not reply.'
    message = render_to_string('account_activation_email_template.html', {
        'domain': get_current_site(request).domain,
        'uid': urlsafe_base64_encode(force_bytes(user.pk)),
        'token': account_activation_token.make_token(user),
        'protocol': 'https'
    })
    email = EmailMessage(mail_subject, message, to=[to_email])
    if email.send():
        print('Email sent successfully')
    else:
        print('Problem sending confirmation email.')

# This function allows the user to verify their email 
def activate(request, uidb64, token):
    User = get_user_model()
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)
    except(TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and account_activation_token.check_token(user, token):
        user.is_active = True
        user.save()

        messages.success(request, 'Thank you for your email confirmation. Now you can login your account.')

        ###REDIRECTION LINK NEEDS TO BE CHANGED ONCE SITE GETS HOSTED
        return redirect("http://localhost:3000/login")
    else:
        messages.error(request, 'Activation link is invalid!')
    
    ###REDIRECTION LINK NEEDS TO BE CHANGED ONCE SITE GETS HOSTED
    return redirect("http://localhost:3000")


# A function to create a connection between users.
@api_view(['POST'])
def createConnection(request, sender_id, recipient_id):
    sender_user = get_object_or_404(User, id=sender_id)
    recipient_user = get_object_or_404(User, id=recipient_id)

    if Connection.objects.filter(sender=sender_user, recipient=recipient_user).exists():
        return JsonResponse({'message': 'Connection request already exists.'}, status=400)
    
    if Connection.objects.filter(recipient=sender_user, sender=recipient_user).exists():
        return JsonResponse({'message': 'Connection request already exists.'}, status=400)
    
    connection = Connection.objects.create(sender=sender_user, recipient=recipient_user, status='pending')
    connection.save()

    return JsonResponse({'message': 'Connection request sent successfully.'}, status=201)

#A function to check the connection status.
def connectionStatus(request, user1_id, user2_id):
    user1 = get_object_or_404(User, id=user1_id)
    user2 = get_object_or_404(User, id=user2_id)

    connection1 = Connection.objects.filter(sender=user1, recipient=user2).first()
    if connection1:
        if connection1.status == 'pending':
            status = 'Pending'
        elif connection1.status == 'accepted':
            status = 'Connected'
        elif connection1.status == 'rejected':
            status = 'Rejected'
    else:
        connection2 = Connection.objects.filter(sender=user2, recipient=user1).first()
        if connection2:
            if connection2.status == 'pending':
                status = 'Confirm'
            elif connection2.status == 'accepted':
                status = 'Connected'
            elif connection2.status == 'rejected':
                status = 'Rejected'
        else:
            status = 'No Connection'
    return JsonResponse({'status': status})

#A function to accept a connection.
@api_view(['PUT'])
def acceptConnection(request, user1_id, user2_id):
    recipient = get_object_or_404(User, id=user2_id)
    connection = Connection.objects.filter(sender_id=user1_id, recipient=recipient).first()
    
    if not connection:
        return JsonResponse({'message': 'Connection request not found.'}, status=404)
    
    if connection.recipient != recipient:
        return JsonResponse({'message': 'Only the recipient can accept the connection request.'}, status=403)
    
    if connection.status != 'pending':
        return JsonResponse({'message': 'Connection request has already been accepted or rejected.'}, status=400)
    
    connection.status = 'accepted'
    connection.save()
    
    return JsonResponse({'message': 'Connection request accepted successfully.'}, status=200)

#A function to reject a connection.
@api_view(['DELETE', 'GET'])
def rejectConnection(request, user1_id, user2_id):
    connection = Connection.objects.filter(sender_id=user1_id, recipient_id=user2_id).first()
    if not connection:
        return JsonResponse({'message': 'Connection request not found.'}, status=404)
    if connection.recipient_id != user2_id:
        return JsonResponse({'message': 'Only the recipient can reject this connection request.'}, status=400)
    if connection.status != 'pending':
        return JsonResponse({'message': 'Connection request has already been accepted or rejected.'}, status=400)
    connection.delete()
    return JsonResponse({'message': 'Connection request rejected successfully.'}, status=200)

# This function cancels a pending connection.
@api_view(['DELETE', 'GET'])
def cancelConnection(request, user1_id, user2_id):
    connection = Connection.objects.filter(sender_id=user1_id, recipient_id=user2_id).first()
    if not connection:
        return JsonResponse({'message': 'Connection request not found.'}, status=404)
    if connection.sender_id != user1_id:
        return JsonResponse({'message': 'Only the sender can cancel this connection request.'}, status=400)
    if connection.status != 'pending':
        return JsonResponse({'message': 'Connection request has already been accepted or rejected.'}, status=400)
    connection.delete()
    return JsonResponse({'message': 'Connection request cancelled successfully.'}, status=200)

#A function to disconnect or delete a connection between users.
@api_view(['DELETE', 'GET'])
def deleteConnection(request, user1_id, user2_id):
    connection = Connection.objects.filter(
        sender_id__in=[user1_id, user2_id],
        recipient_id__in=[user1_id, user2_id],
        status='accepted'
    ).first()

    if not connection:
        return JsonResponse({'message': 'Connection does not exist or has not been accepted.'}, status=400)

    connection.delete()
    return JsonResponse({'message': 'Connection deleted successfully.'}, status=200)

# This function returns a list of pending connections for which a given user is the recipient
@api_view(['GET'])
def getPendingConnectionsView(request, pk):
    connections = Connection.objects.all().filter(recipient_id=pk, status='pending')

    serializer = ConnectionSerializer(connections, many=True)

    return Response(serializer.data)

# This function returns a list of pending connections for which a given user is the sender
@api_view(['GET'])
def getSentPendingConnectionsView(request, pk):
    connections = Connection.objects.all().filter(sender_id=pk, status='pending')

    serializer = ConnectionSerializer(connections, many=True)

    return Response(serializer.data)

# This function returns a list of accepted connections that a given user is apart of (as either sender or recipient)
@api_view(['GET'])
def getConnectionsView(request, pk):
    connections = Connection.objects.all().filter((Q(recipient_id=pk) | Q(sender_id=pk)), status='accepted')

    serializer = ConnectionSerializer(connections, many=True)

    return Response(serializer.data)

# This function returns a list of 5 user profiles who the user is NOT connected to
@api_view(['GET'])
def getPossibleConnectionsView(request, pk):

    try:
        user = User.objects.get(pk=pk)
    except User.DoesNotExist:
        return Response([])

    connections = Connection.objects.all().filter((Q(recipient_id=pk) | Q(sender_id=pk)))
    
    connection_list = []
    for connection in connections:
        if connection.recipient_id not in connection_list:
            connection_list.append(connection.recipient_id)
        if connection.sender_id not in connection_list:
            connection_list.append(connection.sender_id)

    possibleConnections = User.objects.all().exclude(Q(id__in=connection_list) | Q(id=pk))

    if possibleConnections.count() >= 5:
        possibleConnections = possibleConnections[:5]

    serializer = UserSerializer(possibleConnections, many=True)

    return Response(serializer.data)

# This function is intended to allow the user to create a recommendation
@api_view(['POST'])
def createRecommendationView(request, sender_id, receiver_id):
    sender = get_object_or_404(Profile, pk=sender_id)
    
    try:
        receiver = Profile.objects.get(pk=receiver_id)
    except Profile.DoesNotExist:
        return Response({"error": "Receiver profile not found."}, status=status.HTTP_404_NOT_FOUND)
    if sender == receiver:
        return Response({"error": "Cannot recommend yourself."}, status=status.HTTP_400_BAD_REQUEST)
    
    text = request.data.get('text', '')
    recommendation = Recommendations(sender=sender, recipient=receiver, description=text)
    recommendation.save()
    serializer = RecommendationsSerializer(recommendation)

    return Response(serializer.data, status=status.HTTP_201_CREATED)

# This function is intended to allow the user to delete an existing recommendation
@api_view(['DELETE'])
def deleteRecommendationView(request, sender_id, receiver_id):
    
    try:
        recommendation = Recommendations.objects.get(sender_id=sender_id, recipient_id=receiver_id)
    except Recommendations.DoesNotExist:
        return Response({"error": "Recommendation not found."}, status=status.HTTP_404_NOT_FOUND)
    
    recommendation.delete()
    return Response({"message": "Recommendation deleted successfully."}, status=status.HTTP_204_NO_CONTENT)

#Search function for users and jobs.
@api_view(['GET'])
def searchFunction(request):
    search_value = request.GET.get('searchValue')
    company = request.GET.get('company')
    job_type = request.GET.get('jobType')
    salary_min = request.GET.get('salaryMin')
    salary_max = request.GET.get('salaryMax')
    salary_type = request.GET.get('salaryType')
    location = request.GET.get('location')
    employment_term = request.GET.get('employmentTerm')
    listing_type = request.GET.get('listingType')
    is_remote = request.GET.get('remote')

    if search_value is not None:
        jobs = JobListing.objects.filter(title__icontains=search_value)
    else:
        jobs = JobListing.objects.all()

    if company and company != "select an option":
        jobs = jobs.filter(company = company)
    if job_type and job_type != "select an option":
        jobs = jobs.filter(job_type=job_type)
    if salary_min and salary_max:
        jobs = jobs.filter(salary__range=(salary_min, salary_max))
    elif salary_min:
        jobs = jobs.filter(salary__gte=salary_min)
    elif salary_max:
        jobs = jobs.filter(salary__lte=salary_max)
    if salary_type and salary_type != "select an option":
        jobs = jobs.filter(salary_type=salary_type)
    if location and location != "select an option":
        jobs = jobs.filter(location__icontains=location)
    if employment_term and employment_term != "select an option":
        jobs = jobs.filter(employment_term=employment_term)
    if listing_type and listing_type != "select an option":
        jobs = jobs.filter(listing_type=listing_type)
    if is_remote and is_remote != "select an option":
        jobs = jobs.filter(remote=is_remote)
    
    if search_value is None:
        users = []
    else:
        users = User.objects.filter(first_name__icontains =search_value)

    user_serializer = UserSerializer(users, many=True)
    jobs_serializer = JobListingSerializer(jobs, many=True)
    
    data = {
        "users": user_serializer.data,
        "jobs": jobs_serializer.data}
    
    return Response(data)