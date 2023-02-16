from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
import json
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
from .serializers import ProfileSerializer, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer
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
            post_list.append({
                'id': post.id,
                'author': post.author.username,
                'title': post.title,
                'content': post.content,
                'image': post.image.url,
                'likes': post.likes,
                'created_at': post.created_at
            })
        return JsonResponse(post_list, safe=False)


class JobListingCreateView(CreateAPIView):
    print("JobListing recieved")
    permission_classes = [IsAuthenticated]
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
        #return JsonResponse(job, safe=False)
             
        
        
    
        

class JobListingLatestView(APIView):
    def get(self, request):
        jobs = JobListing.objects.all().order_by('-created_at')[:10]
        job_list = []
        for job in jobs:
            job_comments = []
            
            if job.comments is not None:
                job_comments.append({
                    'author': str(job.comments.author),
                    'content': job.comments.content,
                    'created_at': job.comments.created_at
                })
            else:
                job_comments=[]
            job_list.append({
                'id': job.id,
                'author': job.author.username,
                'title': job.title,
                'description': job.description,
                'image': job.image.url,
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