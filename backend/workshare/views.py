from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets
from .serializers import WorkShareSerializer
from .models import WorkShare
from .models import Profile, Post, JobListing, Comment
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer
from django.contrib.auth.hashers import make_password

from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework import status



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
    
    
# still need to figure out how to make it so user must be authenticated/can only edit their own profile
@api_view(['PUT'])
# @permission_classes([IsAuthenticated])
def updateUserProfile(request, pk):
    profile = get_object_or_404(Profile, pk=pk)

    # print("DEBUG : INITIAL PROFILE DATA: ", profile.name, profile.city, profile.title, profile.user)

    data = request.data

    # print("DEBUG : REQUEST DATA: ", data)

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

    # print("DEBUG : MODIFIED PROFILE DATA: ", profile.name, profile.city, profile.title)

    serializer = ProfileSerializerWithToken(profile, many=False)
    
    # print("DEBUG : SERIALIZER DATA: ", serializer.data)

    return Response(serializer.data)
    
    
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

# retrieve specific user's post, for use in viewing user profiles
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
     print("PostListing recieved")
     #permission_classes = [IsAuthenticated]
     queryset = Post.objects.all()
     serializer_class = PostSerializer

     def create(self, validated_data):
        print(self)
        request = self.request 
        #print(request.user)
        print(request)
        # getting the user object from email
        user = User.objects.get(email=request.data['author'])
        post = Post.objects.create(
            author=user,
            title=request.data['title'],
            content=request.data['content'],
            image=request.data['image'],
        )
        post.save()
        #print(post)
        return Response(status=status.HTTP_200_OK)
         #return JsonResponse(job, safe=False)

class JobListingCreateView(CreateAPIView):
    print("Job Listing recieved")
    # permission_classes = [IsAuthenticated]
    queryset = JobListing.objects.all()
    serializer_class = JobListingSerializer

    def create(self, validated_data):
        print(self)
        request = self.request 
        print(request.user)
        print(request)
        job = JobListing.objects.create(
            author=request.user,
            title=request.data['title'],
            description=request.data['description'],
            image=request.data['image'],
            salary=request.data['salary'],
            company = request.data['company'],
            location = request.data['location'],
            status = request.data['status'],
            job_type = request.data['job_type'],
            remote = True#request.data['remote']
        )
        job.save()
        print(job)
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
#@permission_classes([IsAuthenticated])
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
            password=make_password(data['password'])
        )  
        
        serializer = UserSerializerWithToken(user, many=False)
        print('user created!')
    
        return Response(serializer.data)
    except: 
        message = {'detail':'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)
