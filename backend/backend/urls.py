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
from workshare.views import ProfileView, ProfileCreateView
from django.conf import settings
from django.conf.urls.static import static
from workshare import views
from django.contrib.staticfiles.urls import staticfiles_urlpatterns

router = routers.DefaultRouter()
router.register(r'workshares', views.WorkShareView, 'workshare')

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/', include(router.urls)),
    path('api/profile/<int:pk>', ProfileView.as_view(), name='profile_detail'),
    path('api/profile/', ProfileCreateView.as_view(), name='profile_create'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)


urlpatterns += staticfiles_urlpatterns()