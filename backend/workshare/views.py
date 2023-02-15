import time
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
from .models import Profile, Post
from django.contrib.auth.models import User
from .serializers import ProfileSerializer, PostSerializer, UserSerializer, UserSerializerWithToken
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