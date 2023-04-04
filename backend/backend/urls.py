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
from workshare.views import *
from workshare.views import *
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
    path('api/changePassword/<int:pk>', views.changePassword, name='changePassword'),
    path('api/changePasswordForReset/<int:pk>', views.changePasswordForReset, name='changePasswordForReset'),
    path('api/password_reset/', views.password_reset_request, name='password_reset'),
    path('reset/<uidb64>/<token>', views.passwordResetConfirm, name='passwordResetConfirm'),
    path('api/profile/<int:pk>', getProfileView, name='profile_detail'),
    path('api/search-profile/<searchValue>/<receiver_id>/', searchProfilesView, name='profile_detail'),
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
    path('api/job/<int:pk>', views.JobListingView, name='job_detail'),
    path('api/register/' , views.registerUser, name='register'),
    path('api/notification/', views.createNotificationView, name='notification_create'),
    path('api/notification/delete/<int:pk>', views.deleteNotificationView, name='notification_delete'),
    path('api/notification/read/<int:pk>', views.readNotificationView, name='notifications_read'),
    path('api/notification/<int:pk>', views.getNotificationView, name='get_notification'),
    path('api/notifications/user/<int:pk>', views.getNotificationsView, name='get_notifications'),
    path('api/notifications/new/user/<int:pk>', views.checkNewNotificationsView, name='check_new_notifications'),
    path('api/notifications/unread/user/<int:pk>', views.countUnreadNotificationsView, name='count_unread_notifications'),
    path('api/notifications/user/clear/<int:pk>', views.clearNotificationsView, name='notifications_clear'),
    path('api/notifications/user/read_all/<int:pk>', views.readAllNotificationsView, name='notifications_read_all'),
    path('api/connections/create/<int:sender_id>/<int:recipient_id>/', createConnection, name='createConnection'),
    path('api/connections/status/<int:user1_id>/<int:user2_id>/', connectionStatus, name='connectionStatus'),
    path('api/connections/accept/<int:user1_id>/<int:user2_id>/', acceptConnection, name='acceptConnection'),
    path('api/connections/reject/<int:user1_id>/<int:user2_id>/', rejectConnection, name='rejectConnection'),
    path('api/connections/delete/<int:user1_id>/<int:user2_id>/', deleteConnection, name='deleteConnection'),
    path('api/connections/cancel/<int:user1_id>/<int:user2_id>/', views.cancelConnection, name='cancelConnection'),
    path('api/connections/accepted/<int:pk>', views.getConnectionsView, name='getConnections'),
    path('api/connections/pending/<int:pk>', views.getPendingConnectionsView, name='getPendingConnections'),
    path('api/connections/pending_sent/<int:pk>', views.getSentPendingConnectionsView, name='getSentPendingConnections'),
    path('api/connections/possible/<int:pk>', views.getPossibleConnectionsView, name='getPossibleConnections'),
    path('api/create_recommendation/<int:sender_id>/<int:receiver_id>', createRecommendationView, name='create_recommendation'),
    path('api/delete_recommendation/<int:sender_id>/<int:receiver_id>', deleteRecommendationView, name='delete_recommendation'),
    path('api/job_alerts/<int:pk>/', views.getJobAlertsView, name='get_job_alerts'),
    path('api/job_alerts/delete/<int:pk>/', views.deleteJobAlertView, name='get_job_alerts'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
