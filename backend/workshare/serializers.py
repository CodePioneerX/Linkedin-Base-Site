from rest_framework import serializers
from .models import WorkShare, Profile, Post

class WorkShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShare
        fields = ('id', 'title', 'description', 'completed')
        
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('name', 'email', 'city', 'title', 'about', 'image', 'experience', 'education')
        
        
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'comments', 'likes', 'author')