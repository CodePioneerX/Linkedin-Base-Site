from django.db import models
from django.contrib.auth.models import User
from django.contrib.contenttypes.fields import GenericForeignKey
from django.contrib.contenttypes.models import ContentType
import datetime

# definition of global variables that will be reused in more than one model
ANNUALLY = 'ANNUALLY'
HOURLY = 'HOURLY'
FLATRATE = 'FLATRATE'

SALARY_TYPE_CHOICES = [
    (ANNUALLY, 'Annually'),
    (HOURLY, 'Hourly'),
    (FLATRATE, 'FlatRate')
]

PERMANENT = 'PERMANENT'
TEMPORARY = 'TEMPORARY'
CONTRACT = 'CONTRACT'
CASUAL = 'CASUAL'

EMPLOYMENT_TERM_CHOICES = [
    (PERMANENT, 'Permanent'),
    (TEMPORARY, 'Temporary'),
    (CONTRACT, 'Contract'),
    (CASUAL, 'Casual')
]

FULLTIME = 'FULLTIME'
PARTTIME = 'PARTTIME'
INTERNSHIP = 'INTERNSHIP'
FREELANCE = 'FREELANCE'

JOB_TYPE_CHOICES = [
    (FULLTIME, 'FullTime'),
    (PARTTIME, 'PartTime'),
    (INTERNSHIP, 'Internship'),
    (FREELANCE, 'Freelance')
]

INTERNAL = 'INTERNAL'
EXTERNAL = 'EXTERNAL'

LISTING_TYPE_CHOICES = [
    (INTERNAL, 'Internal'),
    (EXTERNAL, 'External')
]

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
    
# The Post class creates and designs the model for posts. A post will consist 7 data fields, inlcuding the time of posting.     
class Post(models.Model):
    #list of data fields and their accepted format are defined here.
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=255)
    content = models.TextField()
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    reported = models.BooleanField(default=False)
    
    @property
    def num_likes(self):
        num_likes = Likes.objects.filter(post=self).count()
        return num_likes

    @property
    def num_comments(self):
        num_comments = Comment.objects.filter(post=self).count()
        return num_comments
    
    def __str__(self):
        return self.author.email + ': ' + self.title

# The Comment class creates and designs the model for comments. A comment will consist of 4 data fields: the author, the content, and the time of posting. 
class Comment(models.Model):
    #list of data fields and their accepted format are defined here.
    author = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_comment')
    content = models.TextField(default=" ")
    created_at = models.DateTimeField(auto_now_add=True)  

    def __str__(self):
        return self.author.email + ': ' + self.content

#The Likes model represents the amount of like for a post.
class Likes(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE, related_name='post_likes')

    def __str__(self):
        return self.user.email + ': ' + self.post.title
    
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
    image = models.ImageField(upload_to='images/', null=True, blank=True)
    location = models.CharField(max_length=255)
    status = models.BooleanField(default=True)
    required_docs = models.ManyToManyField('Document', default=None, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    deadline = models.DateTimeField(default=get_deadline)
    salary = models.IntegerField(default=0)
    salary_type = models.CharField(
        max_length=8,
        choices=SALARY_TYPE_CHOICES,
        default=HOURLY
    )
    employment_term = models.CharField(
        max_length=9,
        choices=EMPLOYMENT_TERM_CHOICES,
        default=PERMANENT
    )
    job_type = models.CharField(
        max_length=10,
        choices=JOB_TYPE_CHOICES,
        default=FULLTIME
    )
    listing_type = models.CharField(
        max_length=8,
        choices=LISTING_TYPE_CHOICES,
        default=INTERNAL
    )
    link = models.TextField(blank=True)

    # reported = models.BooleanField(default=False, blank=False, null=False)

    def get_required_docs(self):
        return ",".join([str(p) for p in self.required_docs.all()])

    def save(self, *args, **kwargs):
        """Override link if listing_type set to Internal"""
        if self.listing_type == 'INTERNAL':
            self.link = ''
        super().save(*args, **kwargs)

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

class JobAlert(models.Model):
    """
    Stores a single JobAlert associated with a User.
    The JobAlert will be based on a saved Search and filter.
    """
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    search_term = models.CharField(max_length=255)
    company = models.CharField(max_length=255, blank=True, null=True)
    location = models.CharField(max_length=255, blank=True, null=True)
    job_type = models.CharField(
        max_length=10,
        choices=JOB_TYPE_CHOICES,
        blank=True,
        null=True
    )
    employment_term = models.CharField(
        max_length=9,
        choices=EMPLOYMENT_TERM_CHOICES,
        blank=True,
        null=True
    )
    salary_type = models.CharField(
        max_length=8,
        choices=SALARY_TYPE_CHOICES,
        blank=True,
        null=True
    )
    min_salary = models.IntegerField(blank=True, null=True)
    max_salary = models.IntegerField(blank=True, null=True)
    listing_type = models.CharField(
        max_length=8,
        choices=LISTING_TYPE_CHOICES,
        blank=True,
        null=True
    )
    remote = models.BooleanField(blank=True, null=True)

    def __str__(self):
        return self.search_term + ' ' + self.user.first_name

class UserReport(models.Model):
    sender = models.ForeignKey(User, related_name='sender', on_delete=models.CASCADE)
    recipient = models.ForeignKey(User, related_name='recipient', on_delete=models.CASCADE)
    message = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.sender.email + ' reported ' + self.recipient.email 

class PostReport(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, related_name='reported_post', on_delete=models.CASCADE)
    message = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.sender.email + ' reported post: ' + self.post.title

class JobReport(models.Model):
    sender = models.ForeignKey(User, on_delete=models.CASCADE)
    job = models.ForeignKey(JobListing, related_name='reported_job', on_delete=models.CASCADE)
    message = models.TextField(blank=False, null=False)

    def __str__(self):
        return self.sender.email + ' report job: ' + self.job.title + ' at ' + self.job.company



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






