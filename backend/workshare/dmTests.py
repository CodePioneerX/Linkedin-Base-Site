from django.test import TestCase, Client
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase, APIClient
from .models import Conversation, DirectMessage
from django.contrib.auth.models import User
from .serializers import ConversationSerializer, MessageSerializer

class ConversationTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1', password='testpass1')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpass2')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
        self.conversation = Conversation.objects.create()
        self.conversation.participants.set([self.user1, self.user2])

    def test_get_conversation_list(self):
        response = self.client.get(reverse('conversation-list'))
        conversations = Conversation.objects.all()
        serializer = ConversationSerializer(conversations, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_conversation(self):
        data = {'participants': [self.user1.id, self.user2.id]}
        response = self.client.post(reverse('conversation-list'), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(Conversation.objects.count(), 2)

class MessageTestCase(TestCase):
    def setUp(self):
        self.user1 = User.objects.create_user(
            username='testuser1', password='testpass1')
        self.user2 = User.objects.create_user(
            username='testuser2', password='testpass2')
        self.client = APIClient()
        self.client.force_authenticate(user=self.user1)
        self.conversation = Conversation.objects.create()
        self.conversation.participants.set([self.user1, self.user2])
        self.message = DirectMessage.objects.create(
            conversation=self.conversation,
            sender=self.user1,
            text='Hello, world!'
        )

    def test_get_message_list(self):
        response = self.client.get(reverse('message-list'))
        messages = DirectMessage.objects.all()
        serializer = MessageSerializer(messages, many=True)
        self.assertEqual(response.data, serializer.data)
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_create_message(self):
        data = {'conversation': self.conversation.id, 'sender': self.user1.id, 'text': 'Hello, world!'}
        response = self.client.post(reverse('message-list'), data=data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(DirectMessage.objects.count(), 2)
