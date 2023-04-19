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
        response = self.client.put(url)
        
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
        response = self.client.put(url)
        
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
        self.assertEqual(response.json()['status'], 'Connected')

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
        # Test deleting a connection that exists
        response = self.client.delete(f'/api/connections/delete/{self.connection.sender_id}/{self.connection.recipient_id}/')
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json(), {'message': 'Connection deleted successfully.'})

    def test_deleting_nonexistent_connection(self):
        # Test deleting a connection that doesn't exist
        response = self.client.delete('/api/connections/delete/2/3/')
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json(), {'message': 'Connection does not exist or has not been accepted.'})

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
        response = self.client.delete(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(Connection.objects.filter(sender=self.user1, recipient=self.user2).exists())
        self.assertEqual(response.json()['message'], 'Connection request rejected successfully.')
        
    def test_reject_connection_not_found(self):
        response = self.client.get(reverse('rejectConnection', args=[self.user2.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertIn('message', response.json())
    
    def test_reject_connection_wrong_recipient(self):
        response = self.client.delete(reverse('rejectConnection', args=[self.user2.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertIn('message', response.json())
    
    def test_reject_connection_already_accepted(self):
        self.connection.status = 'accepted'
        self.connection.save()
        response = self.client.delete(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')
        
    def test_reject_connection_already_rejected(self):
        self.connection.status = 'rejected'
        self.connection.save()
        response = self.client.delete(reverse('rejectConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')


class ConnectionAcceptTestCase(TestCase):
    def setUp(self):
        self.client = Client()
        self.user1 = User.objects.create_user(username='user1', password='password123')
        self.user2 = User.objects.create_user(username='user2', password='password123')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        
    def test_accept_connection(self):
        response = self.client.put(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 200)
        self.connection.refresh_from_db()
        self.assertEqual(self.connection.status, 'accepted')
        self.assertEqual(response.json()['message'], 'Connection request accepted successfully.')
    
    def test_accept_connection_not_found(self):
        response = self.client.put(reverse('acceptConnection', args=[self.user1.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_accept_connection_wrong_recipient(self):
        response = self.client.put(reverse('acceptConnection', args=[self.user2.id, self.user1.id]))
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json()['message'], 'Connection request not found.')
    
    def test_accept_connection_already_accepted(self):
        self.connection.status = 'accepted'
        self.connection.save()
        response = self.client.put(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')
        
    def test_accept_connection_already_rejected(self):
        self.connection.status = 'rejected'
        self.connection.save()
        response = self.client.put(reverse('acceptConnection', args=[self.user1.id, self.user2.id]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['message'], 'Connection request has already been accepted or rejected.')


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

class GetPossibleConnectionsViewTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1')
        self.user2 = User.objects.create_user(username='testuser2')
        self.user3 = User.objects.create_user(username='user3@example.com')
        self.user4 = User.objects.create_user(username='user4@example.com')
        Connection.objects.create(sender=self.user1, recipient=self.user2)

    def test_get_possible_connections_success(self):
        url = reverse('getPossibleConnections', args=[self.user1.pk])
        response = self.client.get(url, HTTP_ACCEPT='application/json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        possible_connections = response.data
        self.assertEqual(len(possible_connections), 2)
        self.assertEqual(possible_connections[0]['username'], 'user3@example.com')

    def test_get_possible_connections_with_invalid_pk(self):
        # Attempt to retrieve possible connections for a non-existent user
        response = self.client.get(reverse('getPossibleConnections', kwargs={'pk': 999}))
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Verify that an empty list of users was returned in the response data
        self.assertEqual(response.data, [])

class GetPendingConnectionsViewTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='testuser1')
        self.user2 = User.objects.create_user(username='testuser2')
        self.user3 = User.objects.create_user(username='user3@example.com')
        self.connection1 =  Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        self.connection2 =  Connection.objects.create(sender=self.user1, recipient=self.user3, status='accepted')
        self.url = reverse('getPendingConnections', kwargs={'pk': self.user2.pk})
        self.expected_data = [{
            'id': self.connection1.id,
            'sender': self.connection1.sender.id,
            'recipient': self.connection1.recipient.id,
            'status': self.connection1.status
        }]
    
    def test_get_pending_connections_success(self):
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, self.expected_data)

class GetSentPendingConnectionsViewTestCase(APITestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(username='user1', password='pass')
        self.user2 = User.objects.create_user(username='user2', password='pass')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')
        self.url = reverse('getSentPendingConnections', args=[self.user1.pk])

    def test_get_sent_pending_connections_success(self):
        # Test retrieving sent pending connections for an existing user
        response = self.client.get(self.url, format='json')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        expected_data = ConnectionSerializer([self.connection], many=True).data
        self.assertEqual(response.data, expected_data)


class CancelConnectionViewTestCase(APITestCase):

    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')
        self.connection = Connection.objects.create(sender=self.user1, recipient=self.user2, status='pending')

    def test_cancel_pending_connection(self):
        url = reverse('cancelConnection', args=[self.user1.pk, self.user2.pk])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 200)
        content = json.loads(response.content)
        self.assertEqual(content, {'message': 'Connection request cancelled successfully.'})
    
    def test_cancel_connection_not_found(self):
        # Try to cancel a connection that doesn't exist
        url = reverse('cancelConnection', args=[self.user1.id, self.user1.id])
        response = self.client.delete(url)
        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.json(), {'message': 'Connection request not found.'})

class AdminPostModerationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(username='admin', password='testpass', is_staff=True)
        
        self.client.login(username='admin', password='testpass')
        self.client.force_authenticate(user=self.admin_user)

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')
        self.user3 = User.objects.create_user(username='testuser3', password='testpass', is_active=False)

        self.post1 = Post.objects.create(author=self.user1, title='test post 1', content='content')
        self.post2 = Post.objects.create(author=self.user1, title='test post 2', content='content2')

        self.post3 = Post.objects.create(author=self.user3, title='test post 3', content='post content from banned user')

        self.post_report1 = PostReport.objects.create(sender=self.user2, post=self.post1, message='test report message 1')
        self.post_report2 = PostReport.objects.create(sender=self.user2, post=self.post2, message='test report message 2')

        self.post_report3 = PostReport.objects.create(sender=self.user2, post=self.post3, message='this post should be hidden')

    def test_get_reported_posts(self):
        response = self.client.get(reverse('get-reported-posts'))
        response_data = response.json()

        serializer1 = PostReportSerializer(self.post_report1)
        serializer2 = PostReportSerializer(self.post_report2)

        self.assertEqual(len(response_data), 2)
        self.assertEqual(response_data[0], serializer2.data)
        self.assertEqual(response_data[1], serializer1.data)

    def test_dismiss_reported_post(self):
        response = self.client.delete(reverse('dismiss-post-report', args=[self.post_report1.id]))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(PostReport.objects.filter(sender=self.user1, post=self.post1, message='test report message 1'))
        self.assertEqual(response.json()['detail'], 'This post report has been dismissed.')
    
    def test_dismiss_reported_post_not_found(self):
        response = self.client.delete(reverse('dismiss-post-report', args=[5]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The post report could not be dismissed at this time.')

class AdminJobModerationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(username='admin', password='testpass', is_staff=True)
        
        self.client.login(username='admin', password='testpass')
        self.client.force_authenticate(user=self.admin_user)

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')
        self.user3 = User.objects.create_user(username='testuser3', password='testpass', is_active=False)

        self.job1 = JobListing.objects.create(author=self.user1, 
                                              title='test job title 1', 
                                              description='description', 
                                              company='example company', 
                                              location='example location')
        self.job2 = JobListing.objects.create(author=self.user1, 
                                              title='test job title 2', 
                                              description='description2', 
                                              company='example company 2', 
                                              location='example location 2')

        self.job3 = JobListing.objects.create(author=self.user3, 
                                              title='test job title 3', 
                                              description='job description from banned user', 
                                              company='example company 3', 
                                              location='example location 3')

        self.job_report1 = JobReport.objects.create(sender=self.user2, job=self.job1, message='test report message 1')
        self.job_report2 = JobReport.objects.create(sender=self.user2, job=self.job2, message='test report message 2')

        self.job_report3 = JobReport.objects.create(sender=self.user2, job=self.job3, message='this job should be hidden')

    def test_get_reported_jobs(self):
        response = self.client.get(reverse('get-reported-jobs'))
        response_data = response.json()

        serializer1 = JobReportSerializer(self.job_report1)
        serializer2 = JobReportSerializer(self.job_report2)

        self.assertEqual(len(response_data), 2)
        self.assertEqual(response_data[0], serializer2.data)
        self.assertEqual(response_data[1], serializer1.data)

    def test_dismiss_reported_job(self):
        response = self.client.delete(reverse('dismiss-job-report', args=[self.job_report1.id]))
        self.assertEqual(response.status_code, 200)
        self.assertFalse(JobReport.objects.filter(sender=self.user1, job=self.job1, message='test report message 1'))
        self.assertEqual(response.json()['detail'], 'This job report has been dismissed.')
    
    def test_dismiss_reported_job_not_found(self):
        response = self.client.delete(reverse('dismiss-job-report', args=[999]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The job report could not be dismissed at this time.')

class AdminUserModerationTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.admin_user = User.objects.create_user(username='admin', password='testpass', is_staff=True)
        
        self.client.login(username='admin', password='testpass')
        self.client.force_authenticate(user=self.admin_user)

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')
        self.user3 = User.objects.create_user(username='testuser3', password='testpass')
        self.user4 = User.objects.create_user(username='testuser4', password='testpass')

        Reported, created = Group.objects.get_or_create(name='Reported')

        self.user_report1 = UserReport.objects.create(sender=self.user1, recipient=self.user3, message='report message from testuser1')
        self.user_report2 = UserReport.objects.create(sender=self.user2, recipient=self.user3, message='report message from testuser2')

        self.reported = Group.objects.get(name='Reported')
        self.reported.user_set.add(self.user3)

    def test_get_reported_users(self):
        self.reported.user_set.add(self.user4)
        
        response = self.client.get(reverse('get-reported-users'))
        response_data = response.json()
        
        self.assertEqual(len(response_data), 2)

    def test_get_reported_users_one_banned(self):
        self.user4.is_active = False
        self.user4.save()
        self.reported.user_set.add(self.user4)

        response = self.client.get(reverse('get-reported-users'))
        response_data = response.json()

        self.assertEqual(len(response_data), 1)
        self.assertEqual(response_data[0]['id'], self.user3.id)

    def test_get_user_report_messages(self):
        response = self.client.get(reverse('get-reported-user-messages', args=[self.user3.id]))
        response_data = response.json()
        self.assertEqual(len(response_data), 2)
        
    def test_get_user_report_messages_none(self):
        response = self.client.get(reverse('get-reported-user-messages', args=[self.user1.id]))
        response_data = response.json()
        self.assertEqual(len(response_data), 0)
    
    def test_dismiss_user_report(self):
        response = self.client.delete(reverse('dismiss-user-report', args=[self.user3.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'The reports against this user have been dismissed.')
        reported_users = User.objects.filter(groups__name='Reported')
        self.assertFalse(reported_users.exists())

    def test_dismiss_user_report_not_found(self):
        response = self.client.delete(reverse('dismiss-user-report', args=[999]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The report could not be dismissed at this time.')

    def test_ban_user(self):
        response = self.client.put(reverse('ban-user', args=[self.user3.id]))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'The user has been banned.')
        banned_user = User.objects.get(id=self.user3.id)
        self.assertFalse(banned_user.is_active)
    
    def test_ban_user_not_found(self):
        response = self.client.put(reverse('ban-user', args=[999]))
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The user could not be banned at this time.')

class UserPostReportTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.post1 = Post.objects.create(author=self.user1, title='test post 1', content='content')
        self.post2 = Post.objects.create(author=self.user1, title='test post 2', content='content2')

        self.report_data = {'sender': self.user2.id, 'post': self.post1.id, 'message': 'test report message'}
        self.report_data_false = {'sender': 999, 'post': 999, 'message': 'not a real post'}

    def test_report_post(self):
        response = self.client.post(reverse('report-post'), data=self.report_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'The post has been reported.')
        reported_post = PostReport.objects.filter(post__id=self.post1.id)
        self.assertTrue(reported_post.exists())
    
    def test_report_post_not_found(self):
        response = self.client.post(reverse('report-post'), data=self.report_data_false)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The post could not be reported at this time.')
        reported_post = PostReport.objects.filter(post__id=999)
        self.assertFalse(reported_post.exists())
    
class UserJobReportTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.job1 = JobListing.objects.create(author=self.user1, 
                                              title='test job title 1', 
                                              description='description', 
                                              company='example company', 
                                              location='example location')

        self.report_data = {'sender': self.user2.id, 'job': self.job1.id, 'message': 'test report message'}
        self.report_data_false = {'sender': 999, 'job': 999, 'message': 'not a real job'}

    def test_report_job(self):
        response = self.client.post(reverse('report-job'), data=self.report_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'The job has been reported.')
        reported_job = JobReport.objects.filter(job__id=self.job1.id)
        self.assertTrue(reported_job.exists())
    
    def test_report_job_not_found(self):
        response = self.client.post(reverse('report-job'), data=self.report_data_false)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The job could not be reported at this time.')
        reported_job = JobReport.objects.filter(job__id=999)
        self.assertFalse(reported_job.exists())
    
class UserReportTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.report_data = {'sender': self.user2.id, 'recipient': self.user1.id, 'message': 'test report message'}
        self.report_data_false = {'sender': 999, 'recipient': 999, 'message': 'not real users'}

        Reported, created = Group.objects.get_or_create(name='Reported')

    def test_report_user(self):
        response = self.client.post(reverse('report-user'), data=self.report_data)
        self.assertEqual(response.status_code, 200)
        self.assertEqual(response.json()['detail'], 'The user has been reported.')
        
        user_report = UserReport.objects.filter(recipient__id=self.user1.id)
        self.assertTrue(user_report.exists())
        self.assertEqual(len(user_report), 1)

        reported_users = User.objects.filter(groups__name='Reported')
        self.assertTrue(reported_users.exists())
        self.assertEqual(len(reported_users), 1)

        self.assertEqual(reported_users[0].id, user_report[0].recipient.id)
    
    def test_report_user_not_found(self):
        response = self.client.post(reverse('report-user'), data=self.report_data_false)
        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.json()['detail'], 'The user could not be reported at this time.')
        
        user_report = UserReport.objects.filter(Q(sender__id=999) | Q(recipient__id=999))
        self.assertFalse(user_report.exists())
