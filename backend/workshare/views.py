from django.shortcuts import render, get_object_or_404
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets
from .serializers import WorkShareSerializer
from .models import WorkShare
from .models import Profile, Post
from .serializers import ProfileSerializer, PostSerializer

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