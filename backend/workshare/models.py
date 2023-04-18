from django.db import models
from django.contrib.auth.models import User

# Create your models here.
class WorkShare(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
    
    
class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, primary_key=True)
    name = models.CharField(max_length=255)
    email = models.EmailField(max_length=255, default='')
    city = models.CharField(max_length=255, default='')
    title = models.CharField(max_length=255)
    about = models.TextField()
    image = models.ImageField(upload_to='images', blank=True, default='images/default.png')
    experience = models.TextField(default='')
    education = models.TextField(default='')
    work = models.TextField(default='')
    volunteering = models.TextField(default='')
    courses = models.TextField(default='')
    projects = models.TextField(default='')
    awards = models.TextField(default='')
    languages = models.TextField(default='')
    
    def __str__(self):
        return self.name

class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)    
    
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    comments = models.ManyToManyField('Comment', blank=True)
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    def __str__(self):
        return self.author.email
    
class JobListing(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    description = models.TextField()
    remote = models.BooleanField(default=False)
    company = models.CharField(max_length=255)
    job_type = models.CharField(max_length=255)
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    comments = models.ForeignKey(Comment, on_delete=models.CASCADE, null=True, blank=True)
    likes = models.IntegerField(default=0)
    salary = models.IntegerField(default=0)
    location = models.CharField(max_length=255)
    status = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title
    

# class Conversation(models.Model):
#     participants = models.ManyToManyField(User, related_name="conversations")

#     def __str__(self):
#         return f"Conversation {self.id}"

#     @classmethod
#     def get_or_create_conversation(cls, user1, user2):
#         conversation = cls.objects.filter(participants=user1).filter(participants=user2).first()
#         if not conversation:
#             conversation = cls.objects.filter(participants=user2).filter(participants=user1).first()
#         if not conversation:
#             conversation = cls.objects.create()
#             conversation.participants.add(user1, user2)
#         return conversation


# class DirectMessage(models.Model):
#     conversation = models.ForeignKey(Conversation, on_delete=models.CASCADE, related_name='messages')
#     sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sent_messages')
#     receiver = models.TextField() #models.ForeignKey(User, on_delete=models.CASCADE, related_name='recieved_messages')
#     receiver_id = models.IntegerField()
#     content = models.TextField()
#     timestamp = models.DateTimeField(auto_now_add=True)

#     def __str__(self):
#         return f"DirectMessage {self.id}"

class Chat(models.Model):
    name = models.CharField(max_length=128)
    participants = models.ManyToManyField(User, related_name='participants', blank=True)

    def add_participant(self, user):
        self.participants.add(user)
        self.save()

    def remove_participant(self, user):
        self.participants.remove(user)
        self.save()

    def get_participant_count(self):
        return self.participants.count()
    
    def get_message_count(self):
        return self.messages.count()


class ChatMessage(models.Model):
    chat = models.ForeignKey(Chat, on_delete=models.CASCADE, related_name="messages")
    from_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="message_from_me")
    to_user = models.ForeignKey(User, on_delete=models.CASCADE, related_name="message_to_you")
    content = models.CharField(max_length=512)
    timestamp = models.DateTimeField(auto_now_add=True)
    read = models.BooleanField(default=False)
    deleted_by = models.ManyToManyField(User, related_name='users_deleted_message', blank=True)






    
