from django.urls import reverse
from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient, APIRequestFactory, force_authenticate
from django.contrib.auth.models import User, Group
from django.db.models import Q
from rest_framework import status
from rest_framework.authtoken.models import Token
from rest_framework.test import force_authenticate
from workshare.models import *
from workshare.serializers import *
import json

class PostListingCreateViewTestCase(APITestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.data = {'author': 'testuser@example.com', 'title': 'Test Post', 'content': 'Test Content', 'image': ''}
    
    def test_create_post(self):
        self.client.force_authenticate(user=self.user)

        url = reverse('post_listing_create')
        response = self.client.post(url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)

        post = Post.objects.get(title='Test Post')
        serializer = PostSerializer(post)

        self.assertEqual(response.data, None)

    def test_create_post_unauthenticated(self):
        url = reverse('post_listing_create')
        response = self.client.post(url, data=self.data)

        self.assertEqual(response.status_code, status.HTTP_200_OK)
