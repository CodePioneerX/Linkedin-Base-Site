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
from rest_framework_simplejwt.views import TokenRefreshView
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
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    path('api/changePassword/<int:pk>', views.changePassword, name='changePassword'),
    path('api/changePasswordForReset/<int:pk>', views.changePasswordForReset, name='changePasswordForReset'),
    path('api/password_reset/', views.password_reset_request, name='password_reset'),
    path('reset/<uidb64>/<token>', views.passwordResetConfirm, name='passwordResetConfirm'),
    path('api/profile/<int:pk>', getProfileView, name='profile_detail'),
    path('api/profile/image/<str:email>', getProfileViewviaEmail, name='profile_detailviaEmail'),
    path('api/my_profile/<int:pk>', getMyProfileView, name='my_profile_detail'),
    path('api/profile/', ProfileCreateView.as_view(), name='profile_create'),
    path('api/profile/update/<int:pk>', updateUserProfile, name='profile_update'),
    path('api/post/<int:pk>', PostView.as_view(), name='post_detail'),
    path('api/newsfeed/<int:pk>', views.PostNewsfeedView, name='newsfeed'),
    path('api/post/', PostCreateView.as_view(), name='post_create'),
    path('api/post/update/<int:pk>', PostUpdateView, name='post_update'),
    path('api/post/delete/<int:pk>', PostDeleteView, name='delete_post'),
    path('api/posts/user/<int:pk>', PersonalNewsfeedView, name='user_posts'),
    path('api/create_post/',PostListingCreateView.as_view(), name='post_listing_create'),
    path('api/create_job/', JobListingCreateView.as_view(), name='job_listing_create'),
    path('api/job/update/<int:pk>', JobListingUpdateView, name='job_listing_update'),
    path('api/job/delete/<int:pk>', JobListingDeleteView, name='job_listing_delete'),
    path('api/jobs/', JobListingLatestView.as_view(), name='job_listing_latest_detail'),
    path('api/jobs/user/<int:pk>', views.getUserJobListingsView, name='get_users_jobs'),
    path('api/job/<int:pk>', views.JobListingView, name='job_detail'),
    path('api/register/' , views.registerUser, name='register'),
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
    path('api/job_alerts/delete/<int:pk>/', views.deleteJobAlertView, name='delete_job_alert'),
    path('api/job_alerts/<int:pk>/create/', views.createJobAlertView, name='create_job_alert'),
    path('api/search/', views.searchFunction, name='search'),
    path('api/job_applications/reject/<int:pk>/', rejectJobApplication, name='reject_job_application'),
    path('api/my_job_applications/', views.getMyApplicationsView, name='my_job_applications'),
    path('api/job/apply/', views.jobApplicationView, name='createjob_application'),
    path('api/job/applications/<int:pk>', views.getJobApplicationsView, name='create_job_application'),
    path('api/jobs_applications/user/<int:pk>', views.getUserJobsWithApplicationsView, name='get_users_jobs_with_applications'),
    path('api/my_job_applications/cancel/<int:pk>/', cancelMyJobApplication, name='cancel_my_job_application'),
    path('api/documentsUpload/<int:pk>/', uploadDocuments, name='upload_documents'),
    path('api/documentRemove/<int:pk>/', removeDocument, name='remove_document'),
    path('api/posts/comment/<int:post_id>/', createComment, name='create_comment'),
    path('api/posts/like/<int:post_id>/', likePost, name='like_post'),
    path('api/users/report/', views.reportUserView, name='report-user'),
    path('api/users/report/dismiss/<int:pk>', views.dismissUserReportView, name='dismiss-user-report'),
    path('api/users/reported', views.getReportedUsersView, name='get-reported-users'),
    path('api/users/reports/<int:pk>', views.getUserReportMessagesView, name='get-reported-user-messages'),
    path('api/users/ban/<int:pk>', views.banUserView, name='ban-user'),
    path('api/posts/report/', views.reportPostView, name='report-post'),
    path('api/posts/report/dismiss/<int:pk>', views.dismissPostReportView, name='dismiss-post-report'),
    path('api/posts/reported', views.getPostReportsView, name='get-reported-posts'),
    path('api/jobs/report/', views.reportJobView, name='report-job'),
    path('api/jobs/report/dismiss/<int:pk>', views.dismissJobReportView, name='dismiss-job-report'),
    path('api/jobs/reported', views.getJobReportsView, name='get-reported-jobs'),
    path('direct_messages/<user_email>/', get_my_chats, name='direct_messages-list'),
    path('chat/<int:chat_id>/send_message/', send_message, name='send_message-create'),
    path('create_chat/<str:name>/<str:user_email>/<str:participant_email>/', create_chat, name='create_chat'),

] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)

urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
