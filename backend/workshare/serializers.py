from rest_framework import serializers
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth.models import User
from .models import WorkShare, Profile, Post, JobListing, Comment, DirectMessage, Conversation

class WorkShareSerializer(serializers.ModelSerializer):
    class Meta:
        model = WorkShare
        fields = ('id', 'title', 'description', 'completed')
        
        
class ProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = Profile
        fields = ('name', 'email', 'city', 'title', 'about', 'image', 'experience', 'education', 'work', 'volunteering', 'courses', 'projects', 'awards', 'languages')
        
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
        fields = ('id', 'title', 'content', 'image', 'likes', 'author')

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

class JobListingSerializer(serializers.ModelSerializer):
    class Meta:
        model = JobListing
        fields = ('id', 'title', 'description','company', 'remote', 'job_type', 'image', 'comments', 'likes', 'salary', 'location', 'status', 'author')

class CommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comment
        fields = ('id', 'content', 'author')

# class DirectMessageSerializer(serializers.ModelSerializer):
#     sender = UserSerializer()
#     #receiver = UserSerializer()
    
#     class Meta:
#         model = DirectMessage
#         fields = ['id', 'sender','receiver','receiver_id', 'content', 'timestamp'] #'receiver', 

class DirectMessageSerializer(serializers.Serializer):
    print("got a post request for a DM ")
    id = serializers.IntegerField(read_only=True)
    sender = UserSerializer(required=False)  # Add 'required=False' to allow existing users
    receiver = serializers.CharField()
    receiver_id = serializers.IntegerField()
    content = serializers.CharField()
    timestamp = serializers.DateTimeField(read_only=True)

    def create(self, validated_data):
        sender_data = validated_data.pop('sender')
        receiver = validated_data.pop('receiver')
        sender = User.objects.get(pk=sender_data.get('id'))
        
        conversation = Conversation.get_or_create_conversation(sender, receiver)
        return DirectMessage.objects.create(sender=sender, conversation=conversation, **validated_data)

class ConversationSerializer(serializers.ModelSerializer):
    messages = DirectMessageSerializer(many=True)

    class Meta:
        model = Conversation
        fields = ['id', 'participants', 'messages']