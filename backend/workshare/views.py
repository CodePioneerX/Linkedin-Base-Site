import time
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
from .models import Profile, Post, JobListing, Comment
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.contrib import messages

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
    
@api_view(['PUT'])    
def PostUpdateView(request, pk):
    post = get_object_or_404(Post, pk=pk)

    data = request.data

    post.title = data['title']
    post.content = data['content']

    post.save()

    serializer = PostSerializer(post, many=False)

    return Response(serializer.data)

@api_view(['DELETE', 'GET'])
def PostDeleteView(request, pk):
    post = Post.objects.get(id=pk)
    post.delete()
    return Response('Post Deleted')

@api_view(['PUT'])
def JobListingUpdateView(request, pk):
    job = get_object_or_404(JobListing, pk=pk)

    data = request.data

    # TO-DO: resolve bugs with remote, status, image fields - they have been disabled for now
    job.title = data['title']
    job.description = data['description']
    # job.remote = data['remote']
    job.company = data['company']
    job.job_type = data['job_type']
    job.salary = data['salary']
    job.location = data['location']
    # job.status = data['active']

    job.save()
    
    serializer = JobListingSerializer(job, many=False)

    return Response(serializer.data)

@api_view(['DELETE', 'GET'])
def JobListingDeleteView(request, pk):
    job = JobListing.objects.get(id=pk)
    job.delete()
    return Response('JobListing Deleted')

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
        
        request = self.request 
        
        job = JobListing.objects.create(
            author=User.objects.get(email=request.data['author']),
            title=request.data['title'],
            description=request.data['description'],
            image=request.data['image'],
            salary=request.data['salary'],
            company = request.data['company'],
            location = request.data['location'],
            status = request.data['status'],
            job_type = request.data['job_type'],
            remote = True
        )
        job.save()
        print("DEBUG : job: ", job)
        return Response(status=status.HTTP_200_OK)

class JobListingLatestView(APIView):
    def get(self, request):
        jobs = JobListing.objects.all().order_by('-created_at')[:10]
        job_list = []
        for job in jobs:
            job_comments = []
            image_path = ""

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
                'salary': job.salary,
                'location': job.location,
                'status': job.status,
                'company': job.company,
                'comments': job_comments,
                'job_type': job.job_type,
                'remote': job.remote
            })
        return JsonResponse(job_list, safe=False)

@api_view(['GET'])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=False)
    return Response(serializer.data)


@api_view(['GET'])
def getProfileView(request, pk):
    profile = get_object_or_404(Profile, pk=pk)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)

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
