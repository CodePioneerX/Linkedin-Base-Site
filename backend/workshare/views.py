import time
from django.shortcuts import render, get_object_or_404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.views import APIView
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser, AllowAny
from rest_framework.response import Response
from rest_framework.generics import CreateAPIView
from rest_framework import viewsets
from .serializers import WorkShareSerializer, ChatSerializer, ChatMessageSerializer
from .models import WorkShare, Chat, ChatMessage
from .models import Profile, Post, JobListing, Comment
from django.contrib.auth.models import User
from rest_framework.authentication import SessionAuthentication, BasicAuthentication
from rest_framework.decorators import authentication_classes
from .serializers import ProfileSerializer, ProfileSerializerWithToken, PostSerializer, UserSerializer, UserSerializerWithToken, JobListingSerializer
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
    
@api_view(['PUT'])    
def PostUpdateView(request, pk):
    post = get_object_or_404(Post, pk=pk)

    data = request.data

    post.title = data['title']
    post.content = data['content']

    post.save()

    serializer = PostSerializer(post, many=False)

    return Response(serializer.data)

@api_view(['DELETE', 'GET'])
def PostDeleteView(request, pk):
    post = Post.objects.get(id=pk)
    post.delete()
    return Response('Post Deleted')

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

@api_view(['GET'])
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




# class ConversationListCreateView(generics.ListCreateAPIView):
#     queryset = Conversation.objects.all()
#     serializer_class = ConversationSerializer


# # class DirectMessageCreateView(generics.CreateAPIView):
# #     queryset = DirectMessage.objects.all()
# #     serializer_class = DirectMessageSerializer

# #     def perform_create(self, serializer):
# #         sender_id = self.request.data.get('sender')
# #         receiver = self.request.data.get('receiver')
# #         receiver_id = 0# self.request.data.get('receiver_id')
# #         sender = User.objects.get(pk=sender_id)
        

# #         conversation = Conversation.get_or_create_conversation(sender, receiver)
# #         serializer.save(conversation=conversation, sender=sender)
# class DirectMessageCreateView(generics.CreateAPIView):
#     queryset = DirectMessage.objects.all()
#     serializer_class = DirectMessageSerializer

#     def perform_create(self, serializer):
#         print("got a post request for a DM: ", self.request.data)
#         sender_email = self.request.data.get('sender').get('email')
#         receiver_email = self.request.data.get('receiver')  # Corrected spelling of "reciever" to "receiver"
#         print("sender: ", sender_email)
#         sender = User.objects.get(email=sender_email)

#         conversation = Conversation.get_or_create_conversation(sender, receiver_email)
#         serializer.save(conversation=conversation, sender=sender)
        
        
# class DirectMessageListView(generics.ListAPIView):
#     queryset = DirectMessage.objects.all()
#     serializer_class = DirectMessageSerializer


# class DirectMessageByUserListView(generics.ListAPIView):
#     serializer_class = DirectMessageSerializer

#     def get_queryset(self):
#         user_id = self.kwargs['user_id']
#         return DirectMessage.objects.filter(sender=user_id)


# class ConversationBetweenUsersView(generics.ListAPIView):
#     serializer_class = DirectMessageSerializer

#     def get_queryset(self):
#         user1_id = self.kwargs['user1_id']
#         user2_id = self.kwargs['user2_id']
#         conversation = Conversation.get_or_create_conversation(User.objects.get(pk=user1_id), User.objects.get(pk=user2_id))
#         return DirectMessage.objects.filter(conversation=conversation)




#@require_http_methods(["POST"])
#@permission_classes([IsAuthenticated])
@api_view(['POST'])
def create_chat(request):
    try:
        user = request.user
        data = request.data
        reciever_id = data.get("reciever_id")
        reciever = User.objects.get(_id=reciever_id)

        chats = Chat.objects.all()
        chat = None
        already_exists = False
        for c in chats:
            participants = c.participants.all()
            if len(participants) > 2: continue
            if (user in participants and reciever in participants):
                already_exists = True
                chat = c

        if already_exists:
            serializer = UserSerializer(chat, context={'user_id': user._id})
            return Response(serializer.data, status=status.HTTP_200_OK)

        chat = Chat.objects.create()
        chat.name = "chat_"+str(chat.id)
        chat.participants.add(user)
        chat.participants.add(reciever)
        chat.save()
        serializer = UserSerializer(chat, context={'user_id': user._id})
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    except Exception as e:
        return Response({"detail": "{}".format(e)}, status=status.HTTP_400_BAD_REQUEST)


#@require_http_methods(["POST"])
#@permission_classes([IsAuthenticated])
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

