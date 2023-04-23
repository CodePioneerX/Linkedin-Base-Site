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

class CreateRecommendationViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sender = User.objects.create(username='test12@soen.com', password='test1', first_name='yogan')
        self.receiver = User.objects.create(username='test123@soen.com', password='test1', first_name='neehaw')

    def test_create_recommendation(self):
        url = reverse('create_recommendation', args=[self.sender.pk, self.receiver.pk])
        data = {'text': 'This is a great recommendation!'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Recommendations.objects.count(), 1)
        recommendation = Recommendations.objects.first()
        self.assertEqual(recommendation.sender.name, self.sender.first_name)
        self.assertEqual(recommendation.recipient.name, self.receiver.first_name)
        self.assertEqual(recommendation.description, 'This is a great recommendation!')
    
    def test_create_recommendation_with_invalid_receiver_id(self):
        url = reverse('create_recommendation', args=[self.sender.pk, self.receiver.pk + 1])
        data = {'text': 'This is a great recommendation!'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        self.assertEqual(Recommendations.objects.count(), 0)
    
    def test_create_recommendation_with_same_sender_and_receiver(self):
        url = reverse('create_recommendation', args=[self.sender.pk, self.sender.pk])
        data = {'text': 'This is a great recommendation!'}
        response = self.client.post(url, data, format='json')

        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(response.data, {'error': 'Cannot recommend yourself.'})
        self.assertEqual(Recommendations.objects.count(), 0)

class RecommendationTests(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.sender = User.objects.create(username='test12@soen.com', password='test1', first_name='yogan')
        self.sender_profile = Profile.objects.create(user=self.sender, name=self.sender.first_name)
        self.recipient = User.objects.create(username='test123@soen.com', password='test1', first_name='neehaw')
        self.recipient_profile = Profile.objects.create(user=self.recipient, name=self.recipient.first_name)
        self.url = reverse('delete_recommendation', args=(self.sender.pk, self.recipient.pk))
        self.recommend = Recommendations.objects.create(sender=self.sender_profile, recipient=self.recipient_profile)

    #def test_delete_existing_recommendation(self):
       #self.assertEqual(response.status_code, status.HTTP_204_NO_CONTENT)
       # self.assertFalse(Recommendations.objects.filter(sender_id=self.sender_id, recipient_id=self.receiver_id).exists())
