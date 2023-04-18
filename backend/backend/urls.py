"""backend URL Configuration

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/3.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from rest_framework import routers
from workshare.views import ProfileView, ProfileCreateView, getProfileView, updateUserProfile
from workshare.views import JobListingCreateView, JobListingLatestView, JobListingUpdateView, JobListingDeleteView
from workshare.views import PostView, PostCreateView, PostUpdateView, PostDeleteView, PostLatestView, PostListingCreateView, UserPostsView#, MessageList, MessageDetail, SendMessage, ReceiveMessages, DeleteMessage
from workshare.views import send_message, create_chat, get_my_chats #ConversationListCreateView, DirectMessageCreateView
from django.conf import settings
from django.conf.urls.static import static
from workshare import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns
from django.conf.urls.static import static

router = routers.DefaultRouter()
router.register(r'workshares', views.WorkShareView, 'workshare')

urlpatterns = [
    path('api/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('api/profile/<int:pk>', getProfileView, name='profile_detail'), 
    path('api/profile/', ProfileCreateView.as_view(), name='profile_create'),
    path('api/profile/update/<int:pk>', updateUserProfile, name='profile_update'),
    path('api/post/<int:pk>', PostView.as_view(), name='post_detail'),
    path('api/posts/', PostLatestView.as_view(), name='post_latest_detail'),
    path('api/post/', PostCreateView.as_view(), name='post_create'),
    path('api/post/update/<int:pk>', PostUpdateView, name='post_update'),
    path('api/post/delete/<int:pk>', PostDeleteView, name='delete_post'),
    path('api/posts/user/<int:pk>', UserPostsView.as_view(), name='user_posts'),
    path('api/create_post/',PostListingCreateView.as_view(), name='post_listing_create'),
    path('api/create_job/', JobListingCreateView.as_view(), name='job_listing_create'),
    path('api/job/update/<int:pk>', JobListingUpdateView, name='job_listing_update'),
    path('api/job/delete/<int:pk>', JobListingDeleteView, name='job_listing_delete'),
    path('api/jobs/', JobListingLatestView.as_view(), name='job_listing_latest_detail'),
    path('api/register/' , views.registerUser, name='register'),
    #path('api/messages/', views.MessageListCreate.as_view(), name='messages_list'),
    #path('api/messages/<int:pk>/', views.MessageRetrieveUpdateDestroy.as_view(), name='message_detail'),
    #path('api/send-message/', SendMessage.as_view(), name='send_message'),
    #path('api/receive-messages/', ReceiveMessages.as_view(), name='receive_message'),
    #path('api/delete-message/<int:pk>/', DeleteMessage.as_view(), name='delete_message'),
    path('direct_messages/<user_email>/', get_my_chats, name='direct_messages-list'),
    #path('api/post/send_message/', send_message, name='send_message-create'),
    path('chat/<int:chat_id>/send_message/', send_message, name='send_message-create'),
    #path('direct_messages/all/', views.DirectMessageListView.as_view(), name='direct_message-list'),
    #path('direct_messages/user/<int:user_id>/', views.DirectMessageByUserListView.as_view(), name='direct_message-by-user'),
    #path('direct_messages/conversation/<int:user1_id>/<int:user2_id>/', views.ConversationBetweenUsersView.as_view(), name='conversation-between-users'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
