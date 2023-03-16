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

class Recommendations(models.Model):
    sender = models.ForeignKey(Profile, on_delete= models.CASCADE, related_name='sent_recommendations')
    recipient = models.ForeignKey(Profile, on_delete= models.CASCADE, related_name='received_recommendations')
    description = models.TextField(default='', blank=True)

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

class Connection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Connected'),
    )
    sender = models.ForeignKey(User, related_name='first_user', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='second_user', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    class Meta:
        unique_together = ('sender', 'recipient')