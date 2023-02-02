from rest_framework import serializers
from .models import WorkShare, Profile, Post
from django.contrib.auth.models import User
from rest_framework.validators import UniqueValidator
from rest_framework_jwt.settings import api_settings

class WorkShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShare
        fields = ('id', 'title', 'description', 'completed')

class UserSerializer(serializers.ModelSerializer):
    username = serializers.CharField(max_length = 30, validators=[UniqueValidator(queryset=User.objects.all())])
    email = serializers.EmailField(required=True, validators=[UniqueValidator(queryset=User.objects.all())])
    #first_name = serializers.CharField(max_length = 30)
    #last_name = serializers.CharField(max_length = 30)
    password = serializers.CharField(min_length=8, write_only = True)

    def create(self, validated_data):
        user = User.objects.create_user( validated_data['username'], email= validated_data['email'])
        user.set_password(validated_data['password'])
        user.save()
        return user

    class Meta:
        model = User
        fields = ('id', 'username', 'email', 'password')

        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('name', 'title', 'about', 'image', 'experience')
        
        
class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'comments', 'likes', 'author')