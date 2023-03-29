from django.urls import reverse
from django.test import TestCase, Client
from rest_framework.test import APITestCase, APIClient
from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.authtoken.models import Token
from workshare.models import Profile, Recommendations, Connection, Post, JobListing
from workshare.serializers import RecommendationsSerializer, ProfileSerializer, PostSerializer


class AcceptConnectionViewTestCase(TestCase):
    
    def setUp(self):
        self.client = Client()
        
        # create test users
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        
        # create test connection
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2)
    
    def test_accept_connection_success(self):
        # login as user2
        self.client.login(username='user2', password='password123')
        
        # make a POST request to accept the connection
        url = reverse('acceptConnection', args=[self.user1.id, self.user2.id])
        response = self.client.post(url)
        
        # check that the connection status has been updated to 'accepted'
        self.connection.refresh_from_db()
        self.assertEqual(self.connection.status, 'accepted')
        
        # check that the response message and status code are correct
        expected_response = {'message': 'Connection request accepted successfully.'}
        self.assertEqual(response.json(), expected_response)
        self.assertEqual(response.status_code, 200)
    
        
    def test_accept_connection_already_accepted(self):
        # login as user2
        self.client.login(username='user2', password='password123')
        
        # update the connection status to 'accepted'
        self.connection.status = 'accepted'
        self.connection.save()
        
        # make a POST request to accept an already accepted connection
        url = reverse('acceptConnection', args=[self.user1.id, self.user2.id])
        response = self.client.post(url)
        
        # check that the response message and status code are correct
        expected_response = {'message': 'Connection request has already been accepted or rejected.'}
        self.assertEqual(response.json(), expected_response)
        self.assertEqual(response.status_code, 400)


class ConnectionStatusViewTestCase(TestCase):
    def setUp(self):
        # Create two users and a connection between them
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2)

    def test_pending_connection(self):
        # Test a connection that is pending
        url = reverse('connectionStatus', args=[self.user1.id, self.user2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Pending')

    def test_accepted_connection(self):
        # Test a connection that has been accepted
        self.connection.status = 'accepted'
        self.connection.save()
        url = reverse('connectionStatus', args=[self.user1.id, self.user2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Accepted')

    def test_rejected_connection(self):
        # Test a connection that has been rejected
        self.connection.status = 'rejected'
        self.connection.save()
        url = reverse('connectionStatus', args=[self.user1.id, self.user2.id])
        response = self.client.get(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['status'], 'Rejected')


class DeleteConnectionViewTestCase(TestCase):
    def setUp(self):
        # Create two users and a connection between them
        self.user1 = User.objects.create_user(username='user1', password='password1')
        self.user2 = User.objects.create_user(username='user2', password='password2')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='accepted')

    def test_delete_accepted_connection(self):
        # Test deleting an accepted connection
        url = reverse('deleteConnection', args=[self.user1.id, self.user2.id])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['message'], 'Connection deleted successfully.')
        self.assertFalse(Connection.objects.filter(sender=self.user1, recipient=self.user2).exists())

    def test_delete_nonexistent_connection(self):
        # Test deleting a non-existent connection
        url = reverse('deleteConnection', args=[self.user1.id, self.user2.id + 1])
        response = self.client.post(url)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection does not exist or has not been accepted.')


class ConnectionTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        
    def test_create_connection(self):
        response = self.client.post(reverse('createConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 201)
        self.assertTrue(Connection.objects.filter(sender=self.user1, recipient=self.user2, status='pending').exists())
        self.assertEqual(response.json()['message'], 'Connection request sent successfully.')
    
    def test_create_connection_already_exists(self):
        connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        response = self.client.post(reverse('createConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request already exists.')

class rejConnectionTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        
    def test_reject_connection(self):
        response = self.client.post(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.connection.refresh_from_db()
        self.assertEqual(self.connection.status, 'rejected')
        self.assertEqual(response.json()['message'], 'Connection request rejected successfully.')
    
    def test_reject_connection_not_found(self):
        response = self.client.post(reverse('rejectConnection', args=[self.user1.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_reject_connection_wrong_recipient(self):
        response = self.client.post(reverse('rejectConnection', args=[self.user2.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_reject_connection_already_accepted(self):
        self.connection.status = 'accepted'
        self.connection.save()
        response = self.client.post(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')
        
    def test_reject_connection_already_rejected(self):
        self.connection.status = 'rejected'
        self.connection.save()
        response = self.client.post(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')


class ConnectionAcceptTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        
    def test_accept_connection(self):
        response = self.client.post(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.connection.refresh_from_db()
        self.assertEqual(self.connection.status, 'accepted')
        self.assertEqual(response.json()['message'], 'Connection request accepted successfully.')
    
    def test_accept_connection_not_found(self):
        response = self.client.post(reverse('acceptConnection', args=[self.user1.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_accept_connection_wrong_recipient(self):
        response = self.client.post(reverse('acceptConnection', args=[self.user2.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_accept_connection_already_accepted(self):
        self.connection.status = 'accepted'
        self.connection.save()
        response = self.client.post(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')
        
    def test_accept_connection_already_rejected(self):
        self.connection.status = 'rejected'
        self.connection.save()
        response = self.client.post(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')


class JobListingCreateViewTestCase(APITestCase):

    def test_create_job_listing(self):
        data = {
            "author": "user@example.com",
            "title": "Software Engineer",
            "description": "We are looking for a talented software engineer...",
            "image": "https://example.com/image.png",
            "salary": 100000,
            "company": "Example Inc.",
            "location": "New York",
            "status": "active",
            "job_type": "full-time"
        }
        response = self.client.post(reverse('job_listing_create'), data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)
    
    def test_create_job_listing_missing_fields(self):
        data = {
            "author": "user@example.com",
            "description": "We are looking for a talented software engineer...",
            "salary": 100000,
            "company": "Example Inc.",
            "location": "New York",
            "status": "active",
            "job_type": "full-time"
        }
        response = self.client.post(reverse('job_listing_create'), data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_job_listing_invalid_author_email(self):
        data = {
            "author": "invalid-email",
            "title": "Software Engineer",
            "description": "We are looking for a talented software engineer...",
            "image": "https://example.com/image.png",
            "salary": 100000,
            "company": "Example Inc.",
            "location": "New York",
            "status": "active",
            "job_type": "full-time"
        }
        response = self.client.post(reverse('job_listing_create'), data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_job_listing_negative_salary(self):
        data = {
            "author": "user@example.com",
            "title": "Software Engineer",
            "description": "We are looking for a talented software engineer...",
            "image": "https://example.com/image.png",
            "salary": -100000,
            "company": "Example Inc.",
            "location": "New York",
            "status": "active",
            "job_type": "full-time"
        }
        response = self.client.post(reverse('job_listing_create'), data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_create_job_listing_invalid_job_type(self):
        data = {
            "author": "user@example.com",
            "title": "Software Engineer",
            "description": "We are looking for a talented software engineer...",
            "image": "https://example.com/image.png",
            "salary": 100000,
            "company": "Example Inc.",
            "location": "New York",
            "status": "active",
            "job_type": "invalid-type"
        }
        response = self.client.post(reverse('job_listing_create'), data=data)
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


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
            status='Open',
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
            status='Closed',
            company='Company 2',
            job_type='Part-time',
            remote=False
        )

    def test_get_latest_jobs(self):
        self.client.force_authenticate(user=self.user)
        response = self.client.get(reverse('job_listing_latest_detail'))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        response_data = response.json()
        self.assertEqual(len(response_data), 2)
        self.assertEqual(response_data[0]['title'], 'Job 1')

