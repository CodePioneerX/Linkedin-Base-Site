from django.urls import reverse
from django.test import TestCase
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from workshare.models import Profile, Recommendations
from workshare.serializers import RecommendationsSerializer


class ProfileTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser', password='testpassword')
        self.profile = Profile.objects.create(
            user=self.user, name='Test User', bio='Test bio')

    def test_get_profile(self):
        client = APIClient()
        response = client.get(f'/api/profile/{self.profile.pk}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.data['user']['username'], 'testuser')

    def test_create_profile(self):
        client = APIClient()
        user = User.objects.create_user(
            username='newuser', password='newpassword')
        response = client.post('/api/profile/', {
            'user': user.pk,
            'name': 'New User',
            'bio': 'New bio'
        })
        self.assertEqual(response.status_code, 201)
        self.assertEqual(Profile.objects.count(), 2)
        self.assertEqual(Profile.objects.last().name, 'New User')
# Create your tests here.
