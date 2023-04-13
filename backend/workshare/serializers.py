from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import *

class WorkShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShare
        fields = ('id', 'title', 'description', 'completed')
        
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'name', 'email', 'city', 'title', 'about', 'image', 'experience', 'education', 'work', 'volunteering', 'courses', 'projects', 'awards', 'languages')
        
class ProfileSerializerWithToken(ProfileSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Profile
        fields = ('name', 'email', 'city', 'title', 'about', 'image', 'experience', 'education', 'work', 'volunteering', 'courses', 'projects', 'awards', 'languages', 'token')

    def get_token(self, obj):
        token = RefreshToken.for_user(obj.user)
        return str(token.access_token)
        
class PostSerializer(serializers.ModelSerializer):
    image = serializers.ImageField(required=False, allow_empty_file=True, use_url=True)
    
    class Meta:
        model = Post
        fields = ('id', 'title', 'content', 'image', 'likes', 'author', 'created_at')

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class DocumentSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=200)
    required = serializers.BooleanField()
        
class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'title', 'description','company', 'remote', 'image', 'comments', 'likes', 'location', 'status', 'author', 'created_at', 'deadline', 'salary', 'salary_type', 'listing_type', 'link', 'employment_term', 'job_type')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author')

class NotificationSerializer(serializers.ModelSerializer):
    class Meta: 
        model = Notification
        fields = ('id', 'sender', 'recipient', 'title', 'content', 'unread', 'created_at', 'type', 'content_type', 'object_id')

class ConnectionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Connection
        fields = '__all__'

class RecommendationsSerializer(serializers.ModelSerializer):
    class Meta:
        model = Recommendations
        fields = '__all__'

class JobAlertSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobAlert
        fields = ('id', 'user', 'search_term', 'company', 'location', 'job_type', 'employment_term', 'salary_type', 'min_salary', 'max_salary', 'listing_type', 'remote')

class JobApplicationSerializer(serializers.ModelSerializer):
    resume = serializers.FileField(source='resume.url')
    cover_letter = serializers.FileField(source='cover_letter.url')
    letter_of_recommendation = serializers.FileField(source='letter_of_recommendation.url')
    portfolio = serializers.FileField(source='portfolio.url')
    transcript = serializers.FileField(source='transcript.url')
    other_documents = serializers.FileField(source='other_documents.url')
    
    class Meta:
        model = JobApplication
        fields = '__all__'