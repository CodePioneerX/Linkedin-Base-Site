import time
import json
from django.shortcuts import get_object_or_404, redirect
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from django.core.exceptions import MultipleObjectsReturned

from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets

from .models import *
from django.contrib.auth.models import User, Group
from .serializers import *

from .serializers import WorkShareSerializer, ChatSerializer, ChatMessageSerializer
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import authentication_classes
from rest_framework.parsers import JSONParser
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer

from django.contrib.auth.hashers import make_password
from django.contrib import messages
from django.db.models import Q
from django.contrib.admin.views.decorators import staff_member_required
import datetime

from itertools import chain
import traceback

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status, generics
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from rest_framework.parsers import MultiPartParser, FormParser

#for email confirmation
from django.template.loader import render_to_string
from django.contrib.auth import get_user_model
from django.contrib.sites.shortcuts import get_current_site
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from django.core.mail import EmailMessage
from .tokens import account_activation_token
from django.utils.decorators import method_decorator
#for dm feature
from django.contrib import messages
#from .models import DirectMessage, Conversation
#from .serializers import ConversationSerializer, DirectMessageSerializer
from rest_framework import generics, permissions, status
from channels.generic.websocket import WebsocketConsumer 
from asgiref.sync import async_to_sync
from django.shortcuts import render
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from django.contrib.auth.models import User
from django.db.models import Q
from django.core.exceptions import ObjectDoesNotExist
from django.core import serializers
from channels.layers import get_channel_layer
from asgiref.sync import async_to_sync
import json

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


@api_view(['POST'])
def reportUserView(request):
    """
    A view function that allows a user to report another user. 
    This is accomplished by adding the user to the 'Reported' User Group.

    Parameters:
    - request: HTTP request object, containing sender of request, recipient of request, and request message.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        data = request.data

        print(data)

        sender = get_object_or_404(User, pk=data['sender'])
        recipient = get_object_or_404(User, pk=data['recipient'])
        message = data['message']

        reported = Group.objects.get(name='Reported')
        reported.user_set.add(recipient)

        report = UserReport(sender=sender, recipient=recipient, message=message)

        report.save()

        message = {'detail':'The user has been reported.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The user could not be reported at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@staff_member_required
def dismissUserReportView(request, pk):
    """
    A view function that allows an admin to dismiss a report made against a user. 
    This is accomplished by removing the user from the 'Reported' User Group.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of User to be removed from the reported list.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        user = get_object_or_404(User, pk=pk)
        reported = Group.objects.get(name='Reported')
        user.groups.remove(reported)

        reports = UserReport.objects.all().filter(recipient__id=pk)

        for report in reports:
            report.delete()

        message = {'detail':'The reports against this user have been dismissed.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The report could not be dismissed at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@staff_member_required
def getReportedUsersView(request):
    """
    A view function that allows an Admin to retrieve a list of all reported Users (who have not yet been banned). 

    Parameters:
    - request: HTTP request object.

    Returns:
    - Response: HTTP Response containing serialized user data, or an error message.
    """
    try: 
        reported = Group.objects.get(name="Reported")
        users = reported.user_set.all()
        users = users.filter(Q(is_active=True))
        serializer = UserSerializer(users, many=True)

        return Response(serializer.data)
    except:
        message = {'detail':'The reported users could not be retrieved at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@staff_member_required
def getUserReportMessagesView(request, pk):
    """
    A view function that allows an Admin to retrieve all of the report messages associated with a certain reported User. 

    Parameters:
    - request: HTTP request object.
    - pk: The primary key of the reported user.

    Returns:
    - Response: HTTP Response containing serialized user report data, or an error message.
    """
    try: 
        reports = UserReport.objects.all().filter(recipient__id=pk)
        serializer = UserReportSerializer(reports, many=True)

        return Response(serializer.data)
    except:
        message = {'detail':'The reported users could not be retrieved at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@staff_member_required
def banUserView(request, pk):
    """
    A view function that allows an admin to ban a user. 
    This is accomplished by setting their account's is_active attribute to False, preventing the user from logging in.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of User to be banned.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        user = get_object_or_404(User, pk=pk)
        user.is_active = False
        user.save()

        message = {'detail':'The user has been banned.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The user could not be banned at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
@staff_member_required
def getPostReportsView(request):
    """
    A view function that allows an Admin to retrieve a list of all reported Posts. 

    Parameters:
    - request: HTTP request object.

    Returns:
    - Response: HTTP Response containing serialized post report data, or an error message.
    """
    try: 
        post_reports = PostReport.objects.all().filter(post__author__is_active=True).order_by('-post__id')
        serializer = PostReportSerializer(post_reports, many=True)

        return Response(serializer.data)
    except:
        message = {'detail':'The reported posts could not be retrieved at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'GET'])
@staff_member_required
def dismissPostReportView(request, pk):
    """
    A view function that allows an admin to dismiss a report made against a post. 

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Post Report to be dismissed from the reported list.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        post_report = get_object_or_404(PostReport, pk=pk)
        post_report.delete()

        message = {'detail':'This post report has been dismissed.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The post report could not be dismissed at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reportPostView(request):
    """
    A view function that allows a user to report a post. 

    Parameters:
    - request: HTTP request object, containing sender of request, a specific post, and the request message.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        data = request.data

        sender = get_object_or_404(User, pk=data['sender'])
        post = get_object_or_404(Post, pk=data['post'])
        message = data['message']

        post.reported = True
        post.save()

        report = PostReport(sender=sender, post=post, message=message)
        report.save()

        message = {'detail':'The post has been reported.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The post could not be reported at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['POST'])
def reportJobView(request):
    """
    A view function that allows a user to report a job. 

    Parameters:
    - request: HTTP request object, containing sender of request, a specific job, and the request message.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        data = request.data

        sender = get_object_or_404(User, pk=data['sender'])
        job = get_object_or_404(JobListing, pk=data['job'])
        message = data['message']

        report = JobReport(sender=sender, job=job, message=message)
        report.save()

        message = {'detail':'The job has been reported.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The job could not be reported at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@staff_member_required
def getJobReportsView(request):
    """
    A view function that allows an Admin to retrieve a list of all reported Jobs. 

    Parameters:
    - request: HTTP request object.

    Returns:
    - Response: HTTP Response containing serialized job data, or an error message.
    """
    try: 
        job_reports = JobReport.objects.all().filter(job__author__is_active=True).order_by('-job__id')
        serializer = JobReportSerializer(job_reports, many=True)

        return Response(serializer.data)
    except:
        message = {'detail':'The reported posts could not be retrieved at this time.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE', 'GET'])
@staff_member_required
def dismissJobReportView(request, pk):
    """
    A view function that allows an admin to dismiss a report made against a job. 

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Job Report to be dismissed from the reported list.

    Returns:
    - Response: HTTP Response with a success/error message.
    """
    try:
        job_report = get_object_or_404(JobReport, pk=pk)
        job_report.delete()

        message = {'detail':'This job report has been dismissed.'}
        return Response(message, status=status.HTTP_200_OK)
    except:
        message = {'detail':'The job report could not be dismissed at this time.'}
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
    profile.image = data['image']
    profile.volunteering = data['volunteering']
    profile.courses = data['courses']
    profile.projects = data['projects']
    profile.awards = data['awards']
    profile.languages = data['languages']

    profile.save()

    serializer = ProfileSerializerWithToken(profile, many=False)

    return Response(serializer.data)
    
@api_view(['GET'])
def PostNewsfeedView(request, pk):
    """
    A view to handle retrieving a user's newsfeed, consisting of their posts and the posts of any other user who they are connected with. 
    """
    user = get_object_or_404(User, pk=pk)
    sent = Connection.objects.all().filter(sender=user).values_list('recipient__username', flat=True)
    received = Connection.objects.all().filter(recipient=user).values_list('sender__username', flat=True)

    connections = list(chain(sent, received, [user.username]))

    posts = Post.objects.all().filter(Q(author__username__in=connections) & Q(author__is_active=True)).order_by('-created_at')
    
    posters = posts.values_list('author', flat=True)

    commentor_list = []

    liked_posts = [] 

    for post in posts:
        comments = Comment.objects.all().filter(post=post)
        commentors = comments.values_list('author', flat=True)
        commentor_list = list(chain(commentors, commentor_list))
        
        liked = Likes.objects.all().filter(Q(post=post) & Q(user=user))
        if liked:
            liked_posts.append(post.id)

    user_profiles = Profile.objects.all().filter(Q(user__id__in=posters) | Q(user__id__in=commentor_list))

    profile_serializer = NewsfeedProfileSerializer(user_profiles, many=True)

    post_serializer = PostSerializer(posts, many=True)
    post_data = post_serializer.data

    for i, post in enumerate(posts):
        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)
        post_data[i]['comments'] = comment_serializer.data
        
        post_data[i]['liked'] = False

        if post_data[i]['id'] in liked_posts:
            post_data[i]['liked'] = True

    data = {
        "profiles": profile_serializer.data,
        "post_data": post_data,
    }
    return Response(data, status=status.HTTP_200_OK)

@api_view(['GET'])
def PersonalNewsfeedView(request, pk):
    """
    A view to handle retrieving a user's personal newsfeed, consisting of their own posts. 
    """
    user = get_object_or_404(User, pk=pk)

    posts = Post.objects.all().filter(author=user).order_by('-created_at')
    
    posters = posts.values_list('author', flat=True)

    commentor_list = []

    for post in posts:
        comments = Comment.objects.all().filter(post=post)
        commentors = comments.values_list('author', flat=True)
        commentor_list = list(chain(commentors, commentor_list))
    
    user_profiles = Profile.objects.all().filter(Q(user__id__in=posters) | Q(user__id__in=commentor_list))

    profile_serializer = NewsfeedProfileSerializer(user_profiles, many=True)

    post_serializer = PostSerializer(posts, many=True)
    post_data = post_serializer.data

    for i, post in enumerate(posts):
        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)
        post_data[i]['comments'] = comment_serializer.data
    
    data = {
        "profiles": profile_serializer.data,
        "post_data": post_data,
    }
    return Response(data, status=status.HTTP_200_OK)

# This function is intended to allow the user to update an existing post that they posted
@api_view(['PUT'])    
def PostUpdateView(request, pk):
    post = get_object_or_404(Post, pk=pk)

    data = request.data

    post.title = data['title']
    post.content = data['content']
        
    if data['image'] != '':
        post.image = data['image']

    post.save()

    serializer = PostSerializer(post, many=False)

    return Response(serializer.data, status=status.HTTP_200_OK)

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

@api_view(['GET'])
def getUserJobListingsView(request, pk):
    """
    A view to handle the retrieval of all of a specific user's Job Listings.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of User whose Job Listings must be retrieved.

    Returns: 
    - Response: Response with the serialized Job Listing information, or error if user is not found.
    """
    try:
        user = get_object_or_404(User, pk=pk)
    except User.DoesNotExist:
        return Response({"error":"The job author cannot be found."}, status=status.HTTP_404_NOT_FOUND)
    
    jobs = JobListing.objects.filter(author=user)

    serializer = JobListingSerializer(jobs, many=True)

    return Response(serializer.data, status=status.HTTP_200_OK)


class JobListingLatestView(APIView):
    def get(self, request):
        """
        A view to handle the retrieval of the Latest Job Listings.

        Parameters:
        - request: An HTTP request object.

        Returns:
        - Response: A JSON response object containing the list of latest Job Listings.
        """
        jobs = JobListing.objects.all().filter(Q(author__is_active=True)).order_by('-created_at')[:10]
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

            if job.image and hasattr(job.image, 'url'):
                image_path = job.image.url

            job_list.append({
                'id': job.id,
                'author': job.author.username,
                'title': job.title,
                'description': job.description,
                'image': image_path,
                'created_at': job.created_at,
                'location': job.location,
                'status': job.status,
                'company': job.company,
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

@api_view(['GET'])
def getNotificationView(request, pk):
    """
    A view that retrieves a specific notification.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Notification to retrieve.

    Returns: 
    - Response: Response containing the serialized Notification data.
    """

    notification = get_object_or_404(Notification, pk=pk)
    
    serializer = NotificationSerializer(notification, many=False)

    return Response(serializer.data)

@api_view(['GET'])
def getNotificationsView(request, pk):
    """
    A view that retrieves a specific user's 10 most recent notifications.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of User whose notifications must be retrieved.

    Returns: 
    - Response: Response containing the serialized Notification data.
    """

    notifications = Notification.objects.all().filter(recipient__id = pk).order_by('-created_at')[:10]

    serializer = NotificationSerializer(notifications, many=True)

    return Response(serializer.data)

@api_view(['GET'])
def checkNewNotificationsView(request, pk):
    """
    A view that checks if a specific user has received new notifications since the last check.
    
    Parameters:
    - request: HTTP request object (contains the datetime of the last check).
    - pk: Primary key of user whose notifications must be checked.
     
    Returns:
    - Response: Response stating if the user does have new notifications, or an error message. 
    """

    date_time = request.GET.get('datetime')

    if date_time.endswith('Z'):
        dt = datetime.datetime.fromisoformat(date_time[:-1])
        
        notifications = Notification.objects.all().filter(Q(recipient__id = pk) & Q(created_at__gt=dt))

        if notifications.__len__() > 0:
            return Response(True)
        else:
            return Response(False)
    else:
        message = {'message':'A problem occurred while checking for new notifications.'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def countUnreadNotificationsView(request, pk):
    """
    A view that retrieves the count of a specific user's unread notifications.

    Parameters: 
    - request: HTTP request object.
    - pk: Primary key of user whose unread notifications must be counted.

    Returns: 
    - Response: Response containing the number of unread notifications that the user has.
    """

    notifications = Notification.objects.all().filter(Q(recipient__id = pk) & Q(unread__exact=True))

    return Response(notifications.__len__())

@api_view(['PUT'])
def readNotificationView(request, pk):
    """
    A view that toggles a notification's unread value. 

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Notification that must be updated.

    Returns:
    - Reponse: Response containing the serialized Notification data.
    """

    notification = get_object_or_404(Notification, pk=pk)
    notification.unread = not(notification.unread)
    notification.save()
    
    serializer = NotificationSerializer(notification, many=False)

    return Response(serializer.data)

@api_view(['PUT'])
def readAllNotificationsView(request, pk):
    """
    A view that marks all of a specific user's notifications as read.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of user whose notifications must be updated.

    Returns:
    - Reponse: Response containing the serialized Notification data.
    """
    
    notifications = Notification.objects.all().filter(recipient__id = pk)

    for notification in notifications:
        notification.unread = False
        notification.save()
    
    serializer = NotificationSerializer(notifications, many=True)

    return Response(serializer.data)

@api_view(['DELETE', 'GET'])
def deleteNotificationView(request, pk):
    """
    A view that deletes a specific Notification.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Notification that must be deleted.

    Returns:
    - Reponse: Response containing success message or error message.
    """

    notification = get_object_or_404(Notification, pk=pk)
    notification.delete()

    return Response('Notification Deleted')

@api_view(['DELETE', 'GET'])
def clearNotificationsView(request, pk):
    """
    A view that clears (deletes) all of a specific user's notifications.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of user whose notifications must be cleared.

    Returns:
    - Reponse: Response containing success message or error message.
    """

    notifications = Notification.objects.all().filter(recipient__id = pk)

    if notifications.__len__() == 0:
        return Response('No notifications to clear')
    
    for notification in notifications:
        notification.delete()

    return Response('Notifications Cleared')

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


@api_view(['GET'])
def getProfileViewviaEmail(request, email):
    profile = get_object_or_404(Profile, email=email)
    profile_serializer = ProfileSerializer(profile)
    return Response(data)

@api_view(['GET'])
def getMyProfileView(request, pk):
    user = get_object_or_404(User, pk=pk)

    profile = get_object_or_404(Profile, user=user)
    profile_serializer = ProfileSerializerWithDocuments(profile)

    sent_recommendations = Recommendations.objects.filter(sender=profile)
    received_recommendations = Recommendations.objects.filter(recipient=profile)

    sent_recommendations_serializer = RecommendationsSerializer(sent_recommendations, many=True)
    received_recommendations_serializer = RecommendationsSerializer(received_recommendations, many=True)

    data = {
        "profile": profile_serializer.data,
        "sent_recommendations": sent_recommendations_serializer.data,
        "received_recommendations": received_recommendations_serializer.data
    }
    return Response(data, status=status.HTTP_200_OK)

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

@api_view(['GET'])
def getJobAlertsView(request, pk):
    """
    A view that retrieves all of a specific user's Job Alerts.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of user whose JobAlerts should must be retrieved.

    Returns:
    - Reponse: Response containing serialized JobAlert data.
    """
    job_alerts = JobAlert.objects.all().filter(user__id=pk)

    serializer = JobAlertSerializer(job_alerts, many=True)

    return Response(serializer.data)

@api_view(['POST', 'GET'])
def createJobAlertView(request, pk):
    """
    A view that creates a Job Alert instance for the specified user.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of user who the JobAlert is being created for.

    Returns:
    - Reponse: Response containing serialized JobAlert data, or error message.
    """
    data = request.data
    
    try: 
        user = get_object_or_404(User, pk=pk)

        if data['remote'] == 'true':
            remote_ = True
        elif data['remote'] == 'false':
            remote_ = False
        else:
            remote_ = ''

        job_alert = JobAlert.objects.create(
            user=user,
            search_term=data['search_value'],
            company=data['company'],
            location=data['location'],
            job_type=data['job_type'],
            employment_term=data['employment_term'],
            min_salary=data['salary_min'],
            max_salary=data['salary_max'],
            salary_type=data['salary_type'],
            listing_type=data['listing_type'],
            remote=remote_
        )

        serializer = JobAlertSerializer(job_alert, many=False)

        return Response(serializer.data)
    except:
        return Response({"error": "Job Alert could not be created"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['DELETE', 'GET'])
def deleteJobAlertView(request, pk):
    """
    A view that deletes a specific Job Alert instance.

    Parameters:
    - request: HTTP request object.
    - pk: Primary key of the JobAlert that is being deleted.

    Returns:
    - Reponse: Response containing success message or error.
    """
    try:
        job_alert = JobAlert.objects.get(id=pk)
        job_alert.delete()
        return Response({"message": "Job Alert deleted."}, status=status.HTTP_200_OK)
    except JobAlert.DoesNotExist:
        return Response({"error": "Job Alert not found."}, status=status.HTTP_404_NOT_FOUND)

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
        jobs = JobListing.objects.filter(Q(title__icontains=search_value) & Q(author__is_active=True))
    else:
        jobs = JobListing.objects.all().filter(Q(author__is_active=True))

    if company and company != "":
        jobs = jobs.filter(company = company)
    if job_type and job_type != "":
        jobs = jobs.filter(job_type=job_type)
    if salary_min and salary_max:
        jobs = jobs.filter(salary__range=(salary_min, salary_max))
    elif salary_min:
        jobs = jobs.filter(salary__gte=salary_min)
    elif salary_max:
        jobs = jobs.filter(salary__lte=salary_max)
    if salary_type and salary_type != "":
        jobs = jobs.filter(salary_type=salary_type)
    if location and location != "":
        jobs = jobs.filter(location__icontains=location)
    if employment_term and employment_term != "":
        jobs = jobs.filter(employment_term=employment_term)
    if listing_type and listing_type != "":
        jobs = jobs.filter(listing_type=listing_type)
    if is_remote and is_remote != "":
        if is_remote != 'true':
            jobs = jobs.filter(remote=False)
        if is_remote != 'false':
            jobs = jobs.filter(remote=True)
    
    if search_value is None:
        users = []
    else:
        users = User.objects.filter(Q(first_name__icontains =search_value) & Q(is_active=True))

    user_serializer = UserSerializer(users, many=True)
    jobs_serializer = JobListingSerializer(jobs, many=True)
    
    data = {
        "users": user_serializer.data,
        "jobs": jobs_serializer.data}
    
    return Response(data)

#This function allows the recurtier to reject an application.
@api_view(['PUT'])
def rejectJobApplication(request, pk):
    job_application = get_object_or_404(JobApplication, id=pk)
    
    if not job_application:
        return Response({'message': 'Job application request not found.'}, status=status.HTTP_404_NOT_FOUND)
    
    job_application.status = 'reject'
    job_application.save()
    return Response({'message': 'Job application request rejected successfully.'}, status=status.HTTP_200_OK)

#This function allows the user to view all the jobs they applied to.
@api_view(['GET'])
def getMyApplicationsView(request):
    job_applications = JobApplication.objects.filter(user=request.user)
    serializer = SimpleJobApplicationSerializer(job_applications, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def getUserJobsWithApplicationsView(request, pk):
    """
    A view to handle the retrieval of all of a user's posted jobs, together with all the applications that were submitted for them.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Job for which the Job Applications must be retrieved.

    Returns: 
    - Response: Response with the serialized Job and Job Application information, or error if the job author is not found.
    """
    job_list = []
    
    try:
        user = get_object_or_404(User, pk=pk)
    except User.DoesNotExist:
        return Response({"error":"The job author cannot be found."}, status=status.HTTP_404_NOT_FOUND)
    
    jobs = JobListing.objects.filter(author=user)

    for job in jobs:
        job_serializer = JobListingSerializer(job, many=False)
        applications = JobApplication.objects.filter(job_post=job,status="true")
        application_serializer = SimpleJobApplicationSerializer(applications, many=True)
        combined = {'job':job_serializer.data, 'applications':application_serializer.data}
        job_list.append(combined)

    return Response(job_list, status=status.HTTP_200_OK)

@api_view(['GET'])
def getJobApplicationsView(request, pk):
    """
    A view to handle the retrieval of all the applications submitted for a specific Job.
    
    Parameters:
    - request: HTTP request object.
    - pk: Primary key of Job for which the Job Applications must be retrieved.

    Returns: 
    - Response: Response with the serialized Job Application information, or error if the job is not found.
    """
    try:
        job = get_object_or_404(JobListing, pk=pk)
    except JobListing.DoesNotExist:
        return Response({"error":"The job cannot be found."}, status=status.HTTP_404_NOT_FOUND)
    
    job_applications = JobApplication.objects.filter(job_post=job, status="true")
    serializer = SimpleJobApplicationSerializer(job_applications, many=True)
    return Response(serializer.data)
    
@api_view(['POST'])
def jobApplicationView(request):
    """
    A view to handle the posting of a Job Application.
    
    Parameters:
    - request: HTTP request object.

    Returns: 
    - Response: Response with the serialized Job Application information, or error if job/user is not found.
    """
    data = request.data

    try:
        job = get_object_or_404(JobListing, pk=data['job_id'])
    except JobListing.DoesNotExist:
        return Response({"error":"The job you are trying to apply for cannot be found."}, status=status.HTTP_404_NOT_FOUND)

    try:
        user = get_object_or_404(User, pk=data['user_id'])
    except User.DoesNotExist:
        return Response({"error":"The user account you are applying with cannot be found."}, status=status.HTTP_404_NOT_FOUND)

    if 'resume' not in data:
        resume = ''
    else:
        resume = data['resume']
    
    if 'coverLetter' not in data:
        coverLetter = ''
    else:
        coverLetter = data['coverLetter']
    
    if 'recommendationLetter' not in data:
        recommendationLetter = ''
    else:
        recommendationLetter = data['recommendationLetter']
    
    if 'portfolio' not in data:
        portfolio = ''
    else:
        portfolio = data['portfolio']
    
    if 'transcript' not in data:
        transcript = ''
    else:
        transcript = data['transcript']
    
    if 'otherDocuments' not in data:
        otherDocuments = ''
    else:
        otherDocuments = data['otherDocuments']

    try: 
        job_application = JobApplication.objects.create(
            user=user,
            job_post=job,
            name=data['name'],
            email=data['email'],
            city=data['city'],
            province=data['provinceState'],
            country=data['country'],
            phone=data['telephone'],
            experience=data['experience'],
            work=data['work'],
            education=data['education'],
            volunteering=data['volunteering'],
            projects=data['projects'],
            courses=data['courses'],
            awards=data['awards'],
            languages=data['languages'],
            resume=resume,
            cover_letter=coverLetter,
            letter_of_recommendation=recommendationLetter,
            portfolio=portfolio,
            transcript=transcript,
            other_documents=otherDocuments
        )

        serializer = SimpleJobApplicationSerializer(job_application, many=False)

        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        print('%s' % type(e))
        message = traceback.format_exc()
        print(message)
        return Response({"error":"Job Application could not be created"}, status=status.HTTP_404_NOT_FOUND)

#This function allows a user to cancel a sent application.
@api_view(['DELETE', 'GET'])
def cancelMyJobApplication(request, pk):
    job_application = get_object_or_404(JobApplication, id=pk)
    if not job_application:
        return Response({'message': 'Job application not found.'}, status=status.HTTP_404_NOT_FOUND)
    if job_application.status != 'true':
        return JsonResponse({'message': 'Job application has already been deleted or rejected.'}, status=status.HTTP_400_BAD_REQUEST)
    job_application.delete()
    return Response({'message': 'Job application request cancelled successfully.'}, status=status.HTTP_200_OK)

@api_view(['POST'])
def uploadDocuments(request, pk):

    data = request.data

    try:
        user = get_object_or_404(User, pk=pk)
    except User.DoesNotExist:
        return Response({"error":"The user account you are trying to access with cannot be found."}, status=status.HTTP_404_NOT_FOUND)

    try: 
        profile = get_object_or_404(Profile, user=user)
    except Profile.DoesNotExist:
        return Response({"error":"The profile you are attempting to upload documents to cannot be found."}, status=status.HTTP_404_NOT_FOUND)
    
    if 'resume' not in data:
        resume = ''
    else:
        resume = data['resume']
        profile.resume = resume
    
    if 'coverLetter' not in data:
        coverLetter = ''
    else:
        coverLetter = data['coverLetter']
        profile.cover_letter = coverLetter
    
    profile.save()

    return Response({"detail":"The documents have been uploaded to your profile."}, status=status.HTTP_200_OK)

@api_view(['PUT'])
def removeDocument(request, pk):

    data = request.data

    try:
        user = get_object_or_404(User, pk=pk)
    except User.DoesNotExist:
        return Response({"error":"The user account you are trying to access with cannot be found."}, status=status.HTTP_404_NOT_FOUND)

    try: 
        profile = get_object_or_404(Profile, user=user)
    except Profile.DoesNotExist:
        return Response({"error":"The profile you are attempting to upload documents to cannot be found."}, status=status.HTTP_404_NOT_FOUND)
    
    if data['type'] == 'resume':
        profile.resume = ''

    if data['type'] == 'cover_letter':
        profile.cover_letter = ''
    
    profile.save()

    return Response({"detail":"The document has been removed from your profile."}, status=status.HTTP_200_OK)

#This function allows a user to comment on a post.
@api_view(['POST'])
def createComment(request, post_id):
    data = request.data

    content = data['content']
    author = User.objects.get(pk=data['user_id'])

    if content:
        post = Post.objects.get(id=post_id)
        comment = Comment(author=author, post=post, content=content)
        comment.save()

        post_serializer = PostSerializer(post, many=False)
        post_data = post_serializer.data

        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)
        post_data['comments'] = comment_serializer.data

        return Response(post_data, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Your comment cannot be empty!'}, status=status.HTTP_400_BAD_REQUEST)

#This function allows the user to like or dislike a post.
@api_view(['POST'])
def likePost(request, post_id):
    try: 
        data = request.data

        post = get_object_or_404(Post, pk=post_id)
        user = get_object_or_404(User, pk=data['user_id'])

        like = Likes.objects.all().filter(post=post, user=user)

        if like:
            like.delete()
            liked = False
        else:
            new_like = Likes.objects.create(user=user, post=post)
            new_like.save()
            liked = True

        post_serializer = PostSerializer(post, many=False)
        post_data = post_serializer.data

        comments = Comment.objects.filter(post=post)
        comment_serializer = CommentSerializer(comments, many=True)
        post_data['comments'] = comment_serializer.data
        post_data['liked'] = liked

        return Response(post_data, status=status.HTTP_200_OK)
    except:
        return Response({'error': 'The post could not be liked.'}, status=status.HTTP_400_BAD_REQUEST)




@api_view(['GET'])
@permission_classes([IsAuthenticated])
def create_group_chat(request):
    try:
        user = request.user
        data = request.data
        reciever_ids = data.get("neighbor_ids")
        recievers = User.objects.filter(_id__in=reciever_ids)

        chats = Chat.objects.all()
        chat = None
        already_exists = False
        for c in chats:
            participants = c.participants.all()
            
            if len(participants) < 3: continue
            if (user in participants and set(recievers).issubset(participants) and len(participants) == len(set(recievers))+1):
                already_exists = True
                chat = c

        if already_exists:
            serializer = ChatSerializer(chat, context={'user_id': user._id})
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.name = "chat_"+str(chat.id)
        chat.participants.add(user)
        for reciever in recievers:
            chat.participants.add(reciever)
        chat.save()
        serializer = ChatSerializer(chat, context={'user_id': user._id})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


#@authentication_classes([SessionAuthentication, BasicAuthentication])
#@permission_classes([IsAuthenticated])
@api_view(['GET'])
def get_my_chats(request, user_email):
    try:
        #user = request.user
        user = User.objects.get(email=user_email)
        chats_with_messages = []
        
        # Filter chats with the user as a participant
        chats = Chat.objects.filter(participants=user)
        
        for c in chats:
            print("c: ", c)
            msg_count = c.get_message_count()
            if msg_count > 0:
                chats_with_messages.append(c)

        serializer = ChatSerializer(
            chats_with_messages, many=True, context={'user_id': user.id})
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


# @permission_classes([IsAuthenticated])
@api_view(['POST'])
def send_message(request, chat_id):
    chat = get_object_or_404(Chat, pk=chat_id)
    user = User.objects.get(email=request.data['from_user'])
    user_to = User.objects.get(email=request.data['to_user'])
    
    user_to_id = user_to.id
    
    # if request.user not in chat.participants.all():
    #     return Response({"detail": "Not a participant of this chat. "+str(request.user)+" not in "+str(chat.participants.all())}, status=status.HTTP_403_FORBIDDEN)
    to_user_id = request.data.get('to_user')
    from_user_id = request.data.get('from_user')
    content = request.data.get('content')

    if not to_user_id or not content:
        return Response({"detail": "Missing to_user or content."}, status=status.HTTP_400_BAD_REQUEST)

    message = ChatMessage(
        chat=chat,
        from_user=user,
        to_user_id=user_to_id,
        content=content
    )
    message.save()
    serializer = ChatMessageSerializer(message)

    return Response(serializer.data, status=status.HTTP_201_CREATED)


@api_view(['GET'])
def create_chat(request, name, user_email, participant_email):
    try:
        user1 = User.objects.get(email=user_email)
        user2 = User.objects.get(email=participant_email)
    except User.DoesNotExist:
        return Response({'error': 'One or both users do not exist'}, status=400)

    if user1 == user2:
        return Response({'error': 'Both emails belong to the same user'}, status=400)

    chat = Chat.objects.create(name=name)
    chat.add_participant(user1)
    chat.add_participant(user2)
    chat.save()

    serializer = ChatSerializer(chat)
    return Response({'pk': serializer.data['id']}, status=201)


#@require_http_methods(["POST"])
#@permission_classes([IsAuthenticated])
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def set_chat_read(request):
    try:
        user = request.user
        data = request.data
        chat_name = data.get("chat_name")
        chat = Chat.objects.get(name=chat_name)
        if user not in chat.participants.all():
            raise Exception
        messages = chat.messages.all()
        for msg in messages:
            if msg.from_user != user:
                msg.read = True
                msg.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


#@require_http_methods(["DELETE"])
#@permission_classes([IsAuthenticated])
@api_view(['POST'])
def delete_chat(request):
    try:
        user = request.user
        data = request.data
        chat_name = data.get("chat_name")
        chat = Chat.objects.get(name=chat_name)
        if user not in chat.participants.all():
            raise Exception
        messages = chat.messages.all()
        for msg in messages:
            msg.deleted_by.add(user)
            msg.save()

        return Response(status=status.HTTP_200_OK)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


@login_required
def get_users(request):
    """
    Returns a list of users to populate the DM list
    """
    users = User.objects.exclude(id=request.user.id)
    users_list = []
    for user in users:
        users_list.append({"id": user.id, "username": user.username})
    return JsonResponse(users_list, safe=False)


