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
from .models import Profile, Post, JobListing, Comment, Recommendations, Connection
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer, RecommendationsSerializer
from django.contrib.auth.hashers import make_password
from django.shortcuts import redirect
from django.contrib import messages

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status

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

# This function is intended to allow the user to delete an existing job post that they created
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

#Search function to look for user profiles.
@api_view(['GET'])
def searchProfilesView(request, searchValue, receiver_id):
    profiles = Profile.objects.filter(name__icontains=searchValue)
    serializer = ProfileSerializer(profiles, many=True)
    print("DEBUG: ", profiles)
    return Response({'receiver_id': receiver_id, 'profile': serializer.data})

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


#A function to create a connection between users.
def createConnection(request, sender_id, recipient_id):
    sender_user = get_object_or_404(User, id=sender_id)
    recipient_user = get_object_or_404(User, id=recipient_id)

    if Connection.objects.filter(sender =sender_user, recipient=recipient_user).exists():
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
            status = 'Accepted'
        elif connection1.status == 'rejected':
            status = 'Rejected'
    else:
        connection2 = Connection.objects.filter(sender=user2, recipient=user1).first()
        if connection2:
            if connection2.status == 'pending':
                status = 'Confirm'
            elif connection2.status == 'accepted':
                status = 'Accepted'
            elif connection2.status == 'rejected':
                status = 'Rejected'
        else:
            status = 'No Connection'
    return JsonResponse({'status': status})

#A function to accept a connection.
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
def rejectConnection(request, user1_id, user2_id):
    connection = Connection.objects.filter(sender_id=user1_id, recipient_id=user2_id).first()
    if not connection:
        return JsonResponse({'message': 'Connection request not found.'}, status=404)
    if connection.recipient_id != user2_id:
        return JsonResponse({'message': 'Only the recipient can reject this connection request.'}, status=400)
    if connection.status != 'pending':
        return JsonResponse({'message': 'Connection request has already been accepted or rejected.'}, status=400)
    connection.status = 'rejected'
    connection.save()
    return JsonResponse({'message': 'Connection request rejected successfully.'}, status=200)

#A function to disconnect or delete a connection between users.
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
