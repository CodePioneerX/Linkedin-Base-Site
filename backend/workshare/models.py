from django.db import models
from django.contrib.auth.models import User
import datetime

# Create your models here.

# This class generates a default model design for all models in the workshare
class WorkShare(models.Model):
    #list of data fields and their accepted format are defined here.
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)
    
    #this function defines what will be returned when the class is printed. The code below will return the title.
    def _str_(self):
        return self.title

# The Profile class creates and designs the profile model. A profile will consist of 15 data fields.       
class Profile(models.Model):
    #list of data fields and their accepted format are defined here.
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
    
    #this function defines what will be returned when the class is printed. The code below will return the name.
    def __str__(self):
        return self.name
    
# The Recommendation class creates and designs the recommendarion model. A recommendation will consist of 3 data fields: the sender, the recipient, and the description of the recommendation. 
class Recommendations(models.Model):
    #list of data fields and their accepted format are defined here.
    sender = models.ForeignKey(Profile, on_delete= models.CASCADE, related_name='sent_recommendations')
    recipient = models.ForeignKey(Profile, on_delete= models.CASCADE, related_name='received_recommendations')
    description = models.TextField(default='', blank=True)
    
# The Comment class creates and designs the model for comments. A comment will consist of 3 data fields: the author, the content, and the time of posting. 
class Comment(models.Model):
    #list of data fields and their accepted format are defined here.
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)    
    
# The Post class creates and designs the model for posts. A post will consist 7 data fields, inlcuding the time of posting.     
class Post(models.Model):
    #list of data fields and their accepted format are defined here.
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    comments = models.ManyToManyField('Comment', blank=True)
    likes = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    
    #this function defines what will be returned when the class is printed. The code below will return the author's email.
    def __str__(self):
        return self.author.email
    
# The JobListing class creates and designs the model for job listings. A job listing will consist of 13 data fields, including the time of posting.   
class JobListing(models.Model):
    
    # get_deadline() returns a default deadline 30 days later than the current day.
    def get_deadline():
        return datetime.datetime.today() + datetime.timedelta(days=30)
    
    #list of data fields and their accepted format are defined here.
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
    required_docs = models.ManyToManyField('Document', default=None, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(default=get_deadline)

    def get_required_docs(self):
        return ",".join([str(p) for p in self.required_docs.all()])

    #this function defines what will be returned when the class is printed. The code below will return the title.
    def __str__(self):
        return self.title
    
class Document(models.Model):
    document_type = models.CharField(max_length=256, unique=True)

    def __str__(self):
        return self.document_type

# The Connection class creates and designs the connection model. The connection model will consist of 3 data fields: the sender, the recipient, and the status of their connection attempt. The possible statuses are pending, accepted and rejected.
class Connection(models.Model):
    STATUS_CHOICES = (
        ('pending', 'Pending'),
        ('accepted', 'Connected'),
    )
    #list of data fields and their accepted format are defined here.
    sender = models.ForeignKey(User, related_name='first_user', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='second_user', on_delete=models.CASCADE)
    status = models.CharField(max_length=10, choices=STATUS_CHOICES, default='pending')

    # This class makes sure that every sender and recipient pair is unique in the database. 
    class Meta:
        unique_together = ('sender', 'recipient')
