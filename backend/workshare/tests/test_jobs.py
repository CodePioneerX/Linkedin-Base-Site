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

class JobListingLatestViewTestCase(APITestCase):

    def setUp(self):
        self.user = User.objects.create_user(
            username='testuser',
            email='testuser@example.com',
            password='testpass'
        )
        self.job1 = JobListing.objects.create(
            author=self.user,
            title='Job 1',
            description='Job description 1',
            salary=5000,
            location='Location 1',
            status=True,
            company='Company 1',
            job_type='Full-time',
            remote=True
        )
        self.job2 = JobListing.objects.create(
            author=self.user,
            title='Job 2',
            description='Job description 2',
            salary=6000,
            location='Location 2',
            status=False,
            company='Company 2',
            job_type='Part-time',
            remote=False
        )

    def test_get_latest_jobs(self):
        url = reverse('job_listing_latest_detail')
        response = self.client.get(url)
        response_data = response.json()
        
        # Check that the response data contains 10 jobs
        self.assertEqual(len(response_data), 2)
