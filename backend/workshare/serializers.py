from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User

from .models import *

from .models import WorkShare, Profile, Post, JobListing, Comment#, DirectMessage, Conversation
from .models import Chat, ChatMessage



class WorkShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShare
        fields = ('id', 'title', 'description', 'completed')

class NewsfeedProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'name', 'email', 'image')

class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('user', 'name', 'email', 'city', 'title', 'about', 'image', 'experience', 'education', 'work', 'volunteering', 'courses', 'projects', 'awards', 'languages')

class ProfileSerializerWithDocuments(serializers.ModelSerializer):
    class Meta: 
        model = Profile
        fields = '__all__'

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
        fields = ('id', 'title', 'content', 'image', 'author', 'created_at', 'num_likes', 'num_comments')

class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)
    isActive = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'isActive']

    def get_isAdmin(self, obj):
        return obj.is_staff
    
    def get_isActive(self, obj):
        return obj.is_active

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name

class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'isActive', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class DocumentSerializer(serializers.Serializer):
    type = serializers.CharField(max_length=200)
    required = serializers.BooleanField()
        
class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'title', 'description','company', 'remote', 'image', 'location', 'status', 'author', 'created_at', 'deadline', 'salary', 'salary_type', 'listing_type', 'link', 'employment_term', 'job_type')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment

        fields = ('id', 'content', 'author', 'created_at')

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

class SimpleJobApplicationSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobApplication
        fields = '__all__'

class UserReportSerializer(serializers.ModelSerializer):
    sender_id = serializers.CharField(read_only=True, source="sender.id")
    sender_email = serializers.CharField(read_only=True, source="sender.email")
    sender_name = serializers.CharField(read_only=True, source="sender.first_name")
    
    class Meta:
        model = UserReport
        fields = ('id', 'sender_id', 'sender_email', 'sender_name', 'recipient', 'message')

class PostReportSerializer(serializers.ModelSerializer):
    sender_id = serializers.CharField(read_only=True, source="sender.id")
    sender_email = serializers.CharField(read_only=True, source="sender.email")
    sender_name = serializers.CharField(read_only=True, source="sender.first_name")
    post_id = serializers.CharField(read_only=True, source="post.id")
    post_title = serializers.CharField(read_only=True, source="post.title")
    post_content = serializers.CharField(read_only=True, source="post.content")
    author_id = serializers.CharField(read_only=True, source="post.author.id")
    author_name = serializers.CharField(read_only=True, source="post.author.first_name")
    
    class Meta:
        model = PostReport
        fields = ('id', 'sender_id', 'sender_email', 'sender_name', 'post_id', 'post_title', 'post_content', 'message', 'author_id', 'author_name')

class JobReportSerializer(serializers.ModelSerializer):
    sender_id = serializers.CharField(read_only=True, source="sender.id")
    sender_email = serializers.CharField(read_only=True, source="sender.email")
    sender_name = serializers.CharField(read_only=True, source="sender.first_name")
    job_id = serializers.CharField(read_only=True, source="job.id")
    job_title = serializers.CharField(read_only=True, source="job.title")
    job_company = serializers.CharField(read_only=True, source="job.company")
    job_location = serializers.CharField(read_only=True, source="job.location")
    author_id = serializers.CharField(read_only=True, source="job.author.id")
    author_name = serializers.CharField(read_only=True, source="job.author.first_name")

    class Meta:
        model = JobReport
        fields = ('id', 'sender_id', 'sender_email', 'sender_name', 'job_id', 'job_title', 'job_company', 'job_location', 'message', 'author_id', 'author_name')

class ChatMessageSerializer(serializers.ModelSerializer):
    from_user = serializers.CharField(source='from_user.username')
    to_user = serializers.CharField(source='to_user.username')
    
    class Meta:
        model = ChatMessage
        fields = ('id', 'from_user', 'to_user','content', 'timestamp', 'read', 'deleted_by')

class ChatSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(label='ID', read_only=True)
    participants = serializers.SerializerMethodField(read_only=True)
    name = serializers.CharField(max_length=128)
    messages = ChatMessageSerializer(many=True, read_only=True)

    class Meta:
        model = Chat
        fields = ('id', 'participants', 'messages', 'name')

    def get_participants(self, obj):
        participants = obj.participants.all()
        return [participant.id for participant in participants]
