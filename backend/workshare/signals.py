from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from django.shortcuts import get_object_or_404
from .models import Profile, Connection, Notification, Recommendations, JobAlert, JobListing
from django.db.models import Q, F, Value, CharField, Count

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, name=instance.first_name, email=instance.username)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

pre_save.connect(updateUser, sender=User)

@receiver(post_save, sender=User)
def notification_legal(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when a User instance is created, notifying them
    of the website's legal backdoor policy. This is a post_save signal, so the signal is sent after the 
    User instance has been saved.

    Parameters:
    - sender: The model class that has sent the signal (in this case, User).
    - instance: The particular instance of the sender model being saved that sent the signal.
    - created: A boolean value that is True if the instance has just been created.
    - kwargs: A dictionary of keyword arguments.
   
    Returns:
    - creates a Notification instance.
    """
    if created:
        Notification.objects.create(
            recipient=instance,
            title='IMPORTANT NOTICE: CONNECT\'s Legal Backdoor Policy',
            content='Our website values the privacy and security of our users. As part of our commitment to maintaining a safe and lawful online environment, we have implemented a policy to prevent and identify illegal activities such as harassment.\n\nUpon registration, users will be informed that our service includes a legal \"backdoor\" which allows us to identify and/or prevent such activities. This backdoor is implemented in accordance with all applicable laws and regulations, and is only used in situations where illegal activity is suspected.\n\nWe take all reports of harassment seriously and will investigate any suspected illegal activity that is reported to us. Our users can trust that their personal information will be kept confidential, and that any use of the backdoor will be done in compliance with all applicable laws and regulations.\n\nBy using our service, users agree to abide by our terms of service and understand that any violation of these terms may result in the use of the backdoor to investigate and prevent illegal activity. We encourage all users to report any suspicious or illegal activity to us immediately. Working together, we can maintain a safe and enjoyable online community for all of our users.',
            type=Notification.SYSTEM
        )

@receiver(post_save, sender=Connection)
def notification_connection_request(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when a new Connection instance is created.
    This is a post_save signal, so the signal is sent after the Connection instance has been saved.
    The recipient of the Connection request is the recipient of the Notification.

    Parameters:
    - sender: The model class that has sent the signal (in this case, Connection).
    - instance: The particular instance of the sender model being saved that sent the signal.
    - created: A boolean value that is True if the instance has just been created.
    - kwargs: A dictionary of keyword arguments.
   
    Returns:
    - creates a Notification instance based on the sender instance attributes.
    """
    if created:
        Notification.objects.create(
            sender=instance.sender,
            recipient=instance.recipient, 
            title=str(instance.sender.first_name) + ' has sent you a connection request.',
            content='',
            type=Notification.CONNECTION,
            object_id=instance.id,
            content_type=ContentType.objects.get_for_model(sender)
        )

@receiver(post_save, sender=Connection)
def notification_connection_accept(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when an existing Connection changes from 'pending' to 'accepted'.
    This is a post_save signal, so the signal is sent after the Connection instance has been saved.

    Note: in this case the sender of the Notification is the recipient of the Connection request, as the 
    sender of the Connection request should be notified that the other person has accepted their request.

    Parameters:
    - sender: The model class that has sent the signal (in this case, Connection).
    - instance: The particular instance of the sender model being saved that sent the signal.
    - created: A boolean value that is True if the instance has just been created.
    - kwargs: A dictionary of keyword arguments.
   
    Returns:
    - creates a Notification instance based on the sender instance attributes.
    """
    if not created:
        if instance.status == 'accepted':
            Notification.objects.create(
                sender=instance.recipient,
                recipient=instance.sender, 
                title=str(instance.recipient.first_name) + ' has accepted your connection request.',
                content='',
                type=Notification.CONNECTION,
                object_id=instance.id,
                content_type=ContentType.objects.get_for_model(sender)
            )

@receiver(post_save, sender=Recommendations)
def notification_recommendation(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when a new Recommendation instance is created.
    It takes the first 255 characters of the Recommendation description to provide a preview of 
    the content in the Notification.
    This is a post_save signal, so the signal is sent after the Recommendation instance has been saved. 
    
    Note: since the Recommendation model uses Profile rather than User to identify sender and recipient, 
    the Notification instance must be created using 'instance.(sender/receiver).user', the User instance 
    associated with the Profile.

    Parameters:
    - sender: The model class that has sent the signal (in this case, Connection).
    - instance: The particular instance of the sender model being saved that sent the signal.
    - created: A boolean value that is True if the instance has just been created.
    - kwargs: A dictionary of keyword arguments.

    Returns:
    - creates a Notification instance based on the sender instance attributes.
    """
    if created:
        rec_content = instance.description

        if len(rec_content) > 255:
            rec_content = rec_content[:255]

        Notification.objects.create(
            sender=instance.sender.user,
            recipient=instance.recipient.user, 
            title=str(instance.sender.user.first_name) + ' has recommended you.',
            content='"' + rec_content + '..."',
            type=Notification.RECOMMENDATION,
            object_id=instance.id,
            content_type=ContentType.objects.get_for_model(sender)
        )

@receiver(post_save, sender=JobListing)
def job_alert_notification(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when a JobListing instanced is created, for Users
    who are associated with a JobAlert with parameters that match the JobListing's attributes.
    This is a post_save signal, so the signal is sent after the JobListing instance has been saved. 

    Parameters:
    - sender: The model class that has sent the signal (in this case, JobListing).
    - instance: The particular instance of the sender model being saved that sent the signal.
    - created: A boolean value that is True if the instance has just been created.
    - kwargs: A dictionary of keyword arguments.

    Returns:
    - creates a Notification instance based on the sender instance attributes.
    """
    if created:
        job_alerts = JobAlert.objects.all() \
            .annotate(search=Value(instance.title, output_field=CharField())) \
            .filter(Q(search__icontains=F('search_term')) &
            (Q(company__isnull=True) | Q(company__iexact=instance.company)) &
            (Q(location__isnull=True) | Q(location__iexact=instance.location)) &
            (Q(job_type__isnull=True) | Q(job_type__iexact=instance.job_type)) &
            (Q(employment_term__isnull=True) | Q(employment_term__iexact=instance.employment_term)) &
            (Q(salary_type__isnull=True) | Q(salary_type__iexact=instance.salary_type)) &
            (Q(min_salary__lte=instance.salary)) &
            (Q(max_salary__gte=instance.salary)) &
            (Q(listing_type__isnull=True) | Q(listing_type__exact=instance.listing_type)) &
            (Q(remote__exact='')) | Q(remote__exact=instance.remote))
        
        distinct_users = job_alerts.values('user').annotate(Count('user'))
        
        for user in distinct_users:
            try:
                recipient = User.objects.get(id=user['user'])
                Notification.objects.create(
                    recipient=recipient, 
                    title='A job has been posted that matches one of your saved searches.',
                    content='Details: ' + instance.title + ' at ' + instance.company + ' in ' + instance.location + '.',
                    type=Notification.JOBALERT,
                    object_id=instance.id,
                    content_type=ContentType.objects.get_for_model(sender)
                )
            except User.DoesNotExist:
                print('Requested user does not exist.')
