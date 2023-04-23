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

class JobApplicationTests(APITestCase):

    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.job = JobListing.objects.create(author=self.user1, title='Test Job', description='Test Job Description')
        self.user = User.objects.create_user(username='testuser', password='testpass')

    def test_create_job_application(self):
        """
        Ensure we can create a new job application object.
        """
        url = reverse('createjob_application')
        data = {
            'job_id': self.job.pk,
            'user_id': self.user.pk,
            'name': 'John Doe',
            'email': 'johndoe@example.com',
            'city': 'New York',
            'provinceState': 'NY',
            'country': 'USA',
            'telephone': '123-456-7890',
            'experience': '5 years',
            'work': 'Test Work Experience',
            'education': 'Test Education',
            'volunteering': 'Test Volunteer Experience',
            'projects': 'Test Projects',
            'courses': 'Test Courses',
            'awards': 'Test Awards',
            'languages': 'Test Languages',
        }
        response = self.client.post(url, data, format='json')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

class CancelJobApplicationTestCase(TestCase):
    def setUp(self):
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.job = JobListing.objects.create(author=self.user, title='Test Job', description='A test job')
        self.job_application = JobApplication.objects.create(
            user=self.user,
            job_post=self.job,
            name='Test User',
            email='testuser@test.com',
            city='Test City',
            province='Test Province',
            country='Test Country',
            phone='1234567890',
            experience='Test Experience',
            work='Test Work',
            education='Test Education',
            volunteering='Test Volunteering',
            projects='Test Projects',
            courses='Test Courses',
            awards='Test Awards',
            languages='Test Languages'
        )
        self.url = reverse('cancel_my_job_application', kwargs={'pk': self.job_application.pk})

class GetJobApplicationsViewTestCase(TestCase):
    def setUp(self):
        self.client = APIClient()
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.job = JobListing.objects.create(author=self.user, title='Test Job', description='A test job')
        self.job_application = JobApplication.objects.create(
            user_id = self.user.pk,
            job_post=self.job,
            name='Test User',
            email='testuser@test.com',
            city='Test City',
            province='Test Province',
            country='Test Country',
            phone='1234567890',
            experience='Test Experience',
            work='Test Work',
            education='Test Education',
            volunteering='Test Volunteering',
            projects='Test Projects',
            courses='Test Courses',
            awards='Test Awards',
            languages='Test Languages'
        )

    def test_get_job_applications_view(self):
        url = reverse('create_job_application', args=[self.job.id])
        response = self.client.get(url)
        job_applications = JobApplication.objects.filter(job_post=self.job, status='true')
        serializer = SimpleJobApplicationSerializer(job_applications, many=True)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, serializer.data)

    def test_get_job_applications_view_with_non_existent_job(self):
        url = reverse('create_job_application', args=[999])
        response = self.client.get(url)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        #self.assertEqual(response.data, {'error': 'The job cannot be found.'})

class RejectJobApplicationTestCase(APITestCase):

    def setUp(self):
        # Create a test user
        self.user = User.objects.create_user(username='testuser', password='testpass')
        self.user1 = User.objects.create_user(username="test1", password="testpass")
        # Create a test job
        self.job = JobListing.objects.create(author=self.user1, title='Test Job', description='A test job')
        # Create a test job application for the user
        self.job_application = JobApplication.objects.create(
            user=self.user,
            job_post=self.job,
            name='Test User',
            email='testuser@test.com',
            city='Test City',
            province='Test Province',
            country='Test Country',
            phone='1234567890',
            experience='Test Experience',
            work='Test Work',
            education='Test Education',
            volunteering='Test Volunteering',
            projects='Test Projects',
            courses='Test Courses',
            awards='Test Awards',
            languages='Test Languages',
            status='true'
        )
        # Create a client and login as the test user
        self.client = APIClient()
        self.client.login(username='testuser', password='testpass')
    
    def test_reject_job_application(self):
        url = reverse('reject_job_application', kwargs={'pk': self.job_application.pk})
        response = self.client.put(url)
        # Check that the response has a status code of 200 OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that the job application's status has been updated to 'reject'
        job_application = JobApplication.objects.get(id=self.job_application.pk)
        self.assertEqual(job_application.status, 'reject')
    
    def test_reject_already_rejected_job_application(self):
        self.job_application.status = 'reject'
        self.job_application.save()
        url = reverse('reject_job_application', kwargs={'pk': self.job_application.pk})
        response = self.client.put(url)
        # Check that the response has a status code of 400 BAD REQUEST
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        # Check that the response message is correct
        self.assertEqual(response.data['message'], 'Job application request rejected successfully.')
    
    def test_reject_nonexistent_job_application(self):
        url = reverse('reject_job_application', kwargs={'pk': 999})
        response = self.client.put(url)
        # Check that the response has a status code of 404 NOT FOUND
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
        # Check that the response message is correct
        self.assertEqual(response.data['detail'], "Not found.")

class JobAlertTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser', email='testuser@example.com', password='testpass')
        
        self.data = {'remote': 'true', 'search_value': 'test', 'company': 'test company', 'location': '', 'job_type':'', 'employment_term': '', 'salary_min': 0, 'salary_max': 100000, 'salary_type':'', 'listing_type':''}
    
    def test_job_alert_create(self):
        response = self.client.post(reverse('create_job_alert', args=[self.user1.id]), data=self.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)
    
    def test_job_alert_created_not_found(self):
        response = self.client.post(reverse('create_job_alert', args=[999]), data=self.data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

