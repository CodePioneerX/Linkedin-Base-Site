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
