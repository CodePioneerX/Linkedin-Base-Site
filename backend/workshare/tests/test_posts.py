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

class CommentTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com', password='testpass')

        self.post1 = Post.objects.create(author=self.user1, title='test post 1 title', content='content of test post 1')

        self.comment_1_data = {'user_id':self.user1.id, 'content': 'content of comment 1'}
        self.comment_2_data = {'user_id':self.user1.id, 'content': ''}

    def test_create_comment(self):
        response = self.client.post(reverse('create_comment', args=[self.post1.id]), data=self.comment_1_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_empty_comment(self):
        response = self.client.post(reverse('create_comment', args=[self.post1.id]), data=self.comment_2_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.json()['error'], 'Your comment cannot be empty!')

class LikeTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com', password='testpass')

        self.post1 = Post.objects.create(author=self.user1, title='test post 1 title', content='content of test post 1')

        self.like_1_data = {'user_id': self.user2.id}

    def test_create_like(self):
        response = self.client.post(reverse('like_post', args=[self.post1.id]), data=self.like_1_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_like_already_liked(self):
        response = self.client.post(reverse('like_post', args=[self.post1.id]), data=self.like_1_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json()['liked'], True)
        
        response_2 = self.client.post(reverse('like_post', args=[self.post1.id]), data=self.like_1_data)

        self.assertEqual(response_2.status_code, status.HTTP_200_OK)
        self.assertEqual(response_2.json()['liked'], False)
        
    def test_create_like_fail(self):
        response = self.client.post(reverse('like_post', args=[999]), data=self.like_1_data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
