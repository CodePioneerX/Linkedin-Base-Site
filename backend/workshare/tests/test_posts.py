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

class PostDeleteTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.post1 = Post.objects.create(author=self.user1, title='test post 1 title', content='content of test post 1')

    def test_delete_post(self):
        response = self.client.delete(reverse('delete_post', args=[self.post1.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), 'Post Deleted')

class PostUpdateTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.post1 = Post.objects.create(author=self.user1, title='test post 1 title', content='content of test post 1')

        self.post1_update_data = {'title': 'updated post 1 title', 'content': 'updated content of test post 1', 'image': ''}
        self.post1_update_data_image = {'title': 'updated post 1 title', 'content': 'updated content of test post 1', 'image': 'image'}

    def test_update_post(self):
        response = self.client.put(reverse('post_update', args=[self.post1.id]), data=self.post1_update_data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        
    def test_update_post_image(self):
        response = self.client.put(reverse('post_update', args=[self.post1.id]), data=self.post1_update_data_image)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_update_post_fail(self):
        response = self.client.put(reverse('post_update', args=[999]), data=self.post1_update_data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class PostNewsfeedTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com', password='testpass')

        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='accepted')

        self.post1 = Post.objects.create(author=self.user2, title='test post 1 title', content='content of test post 1')
        self.post2 = Post.objects.create(author=self.user2, title='test post 2 title', content='content of test post 2')
        self.post3 = Post.objects.create(author=self.user2, title='test post 3 title', content='content of test post 3')
    
        self.comment1 = Comment.objects.create(author=self.user1, post=self.post1, content='test comment')
    
        self.like1 = Likes.objects.create(user=self.user1, post=self.post2)

    def test_newsfeed(self):
        response = self.client.get(reverse('newsfeed', args=[self.user1.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_newsfeed_user_not_found(self):
        response = self.client.get(reverse('newsfeed', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class PersonalNewsfeedTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', email='testuser2@example.com', password='testpass')
        
        self.post1 = Post.objects.create(author=self.user1, title='test post 1 title', content='content of test post 1')
        self.post2 = Post.objects.create(author=self.user1, title='test post 2 title', content='content of test post 2')
        self.post3 = Post.objects.create(author=self.user2, title='test post 3 title', content='content of test post 3')

    def test_personal_newsfeed(self):
        response = self.client.get(reverse('user_posts', args=[self.user1]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_personal_newsfeed_user_not_found(self):
        response = self.client.get(reverse('user_posts', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

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
