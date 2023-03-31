from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType

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

class Notification(models.Model):
    """
    Stores a single notification.
    Attribute sender may be blank/null, as not every notification has a User sender (such as system notifications).
    """

    COMMENT = 'COMMENT'
    CONNECTION = 'CONNECTION'
    JOBALERT = 'JOBALERT'
    LIKE = 'LIKE'
    MESSAGE = 'MESSAGE'
    RECOMMENDATION = 'RECOMMENDATION'
    SYSTEM = 'SYSTEM'

    TYPE_CHOICES = [
        (COMMENT, 'Comment'),
        (CONNECTION, 'Connection'),
        (JOBALERT, 'Job Alert'),
        (LIKE, 'Like'),
        (MESSAGE, 'Message'),
        (RECOMMENDATION, 'Recommendation'),
        (SYSTEM, 'System')
    ]

    sender = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sender_notifcation_set', blank=True, null=True)
    recipient = models.ForeignKey(User, on_delete=models.CASCADE, related_name='recipient_notifcation_set', blank=False, null=False)
    title = models.CharField(max_length=255, blank=False)
    content = models.TextField(blank=False)
    unread = models.BooleanField(default=True, blank=False)
    created_at = models.DateTimeField(auto_now_add=True, blank=False, null=False)
    type = models.CharField(
        max_length=14,
        choices=TYPE_CHOICES,
        default=SYSTEM,
        blank=False
    )

    # mandatory fields for generic relation
    content_type = models.ForeignKey(ContentType, on_delete=models.CASCADE, blank=True, null=True)
    object_id = models.PositiveIntegerField(blank=True, null=True)
    content_object = GenericForeignKey('content_type', 'object_id')

    def __str__(self):
        return self.title

    class Meta:
        indexes = [
            models.Index(fields=["content_type", "object_id"]),
        ]
