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

class GetNotificationsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.notification1 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title', content='test notification content')
        self.notification2 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title 2', content='test notification content 2')

    def test_get_notification(self):
        response = self.client.get(reverse('get_notification', args=[self.notification1.id]))
        serializer = NotificationSerializer(self.notification1, many=False)
        self.assertEqual(serializer.data, response.json())

    def test_get_notification_not_found(self):
        response = self.client.get(reverse('get_notification', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_get_notifications(self):
        response = self.client.get(reverse('get_notifications', args=[self.user1.pk]))
        notifications = Notification.objects.all().filter(recipient__id = self.user1.pk).order_by('-created_at')[:10]
        serializer = NotificationSerializer(notifications, many=True)
        self.assertEqual(serializer.data, response.json())
    
    def test_count_unread_notifications(self):
        notifications = Notification.objects.all().filter(Q(recipient__id=self.user2.pk) & Q(unread__exact=True))
        response = self.client.get(reverse('count_unread_notifications', args=[self.user2.pk]))
        self.assertEqual(notifications.__len__(), response.json())

        self.notification2.unread = False
        self.notification2.save()

        notifications = Notification.objects.all().filter(Q(recipient__id=self.user2.pk) & Q(unread__exact=True))
        response = self.client.get(reverse('count_unread_notifications', args=[self.user2.pk]))
        self.assertEqual(notifications.__len__(), response.json())
        
class ReadNotificationsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.notification1 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title', content='test notification content')
        self.notification2 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title 2', content='test notification content 2')
    
    def test_read_notification(self):
        # initially, notification.unread is True
        self.assertTrue(self.notification1.unread)
        
        # after reading the notification, the response contains the serialized notification data
        # where unread should be False 
        response = self.client.put(reverse('notifications_read', args=[self.notification1.id]))
        self.assertFalse(response.json()['unread'])
        
        # getting the notification to ensure it was saved properly
        updated_notification = Notification.objects.get(id=self.notification1.id)
        self.assertFalse(updated_notification.unread)

        # calling notification_read on a 'read' notification should mark it as unread
        response = self.client.put(reverse('notifications_read', args=[self.notification1.id]))
        self.assertTrue(response.json()['unread'])

        # getting the notification to ensure it was saved properly
        updated_notification = Notification.objects.get(id=self.notification1.id)
        self.assertTrue(updated_notification.unread)
    
    def test_read_notification_not_found(self):
        response = self.client.put(reverse('notifications_read', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_read_all_notifications(self):
        # initially, each notification.unread is True
        user2_notifications = Notification.objects.all().filter(recipient=self.user2)
        for notification in user2_notifications:
            self.assertTrue(notification.unread)
        
        # after reading all notifications, the response contains the serialized notification data
        # where unread for each notification should be False 
        response = self.client.put(reverse('notifications_read_all', args=[self.user2.pk]))
        for notification in response.json():
            self.assertFalse(notification['unread'])

        # getting the notifications to ensure they were was saved properly
        updated_user2_notifications = Notification.objects.all().filter(recipient=self.user2)
        for notification in updated_user2_notifications:
            self.assertFalse(notification.unread)

    def test_read_all_notifications_user_not_found(self):
        response = self.client.put(reverse('notifications_read_all', args=[999]))
        self.assertEqual(response.json().__len__(), 0)

class ClearNotificationsTestCase(APITestCase):
    def setUp(self):
        self.client = APIClient()

        self.user1 = User.objects.create_user(username='testuser1', password='testpass')
        self.user2 = User.objects.create_user(username='testuser2', password='testpass')

        self.notification1 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title', content='test notification content')
        self.notification2 = Notification.objects.create(sender=self.user1, recipient=self.user2, type=Notification.SYSTEM, title='test notification title 2', content='test notification content 2')

    def test_delete_notification(self):
        response = self.client.delete(reverse('notification_delete', args=[self.notification2.id]))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), 'Notification Deleted')

        updated_user2_notifications = Notification.objects.all().filter(recipient=self.user2)
        self.assertTrue(self.notification2 not in updated_user2_notifications)

    def test_delete_notification_not_found(self):
        response = self.client.delete(reverse('notification_delete', args=[999]))
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_clear_notifications(self):
        user2_notifications = Notification.objects.all().filter(recipient=self.user2)
        self.assertEqual(user2_notifications.__len__(), 3)

        response = self.client.delete(reverse('notifications_clear', args=[self.user2.pk]))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.json(), 'Notifications Cleared')

        updated_user2_notifications = Notification.objects.all().filter(recipient=self.user2)

        self.assertEqual(updated_user2_notifications.__len__(), 0)

    def test_clear_notifications_user_not_found(self):
        response = self.client.delete(reverse('notifications_clear', args=[999]))
        self.assertEqual(response.json(), 'No notifications to clear')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
