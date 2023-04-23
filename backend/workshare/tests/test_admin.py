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
