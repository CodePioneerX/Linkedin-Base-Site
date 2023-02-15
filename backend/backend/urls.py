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
from workshare.views import ProfileView, ProfileCreateView, getProfileView
from workshare.views import PostView, PostCreateView, PostLatestView
from django.conf import settings
from django.conf.urls.static import static
from workshare import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

router = routers.DefaultRouter()
router.register(r'workshares', views.WorkShareView, 'workshare')

urlpatterns = [
    path('api/login/', views.MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('activate/<uidb64>/<token>', views.activate, name='activate'),
    #path('api/profile', views.getUserProfile, name='users-profile'),
    path('api/profile/<int:pk>', getProfileView, name='profile_detail'),
    path('api/profile/', ProfileCreateView.as_view(), name='profile_create'),
    path('api/post/<int:pk>', PostView.as_view(), name='post_detail'),
    path('api/posts/', PostLatestView.as_view(), name='post_latest_detail'),
    path('api/post/', PostCreateView.as_view(), name='post_create'),
    path('api/register/' , views.registerUser, name='register'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += staticfiles_urlpatterns()