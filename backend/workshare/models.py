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
    
    
class Post(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    comments = models.ManyToManyField('Comment', blank=True)
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    

    def __str__(self):
        return self.name
    
class Comment(models.Model):
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)