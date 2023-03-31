from django.db.models.signals import pre_save, post_save
from django.contrib.auth.models import User
from django.dispatch import receiver
from django.contrib.contenttypes.models import ContentType
from .models import Profile, Connection, Notification, Recommendations

def updateUser(sender, instance, **kwargs):
    user = instance
    if user.email != '':
        user.username = user.email

@receiver(post_save, sender=User)
def create_profile(sender, instance, created, **kwargs):
    if created:
        Profile.objects.create(user=instance, name=instance.username, email=instance.username)

@receiver(post_save, sender=User)
def save_profile(sender, instance, **kwargs):
    instance.profile.save()

pre_save.connect(updateUser, sender=User)

@receiver(post_save, sender=Connection)
def notification_connection_request(sender, instance, created, **kwargs):
    """
    A signal which creates a Notification instance when a Connection instance is created.
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
    A signal which creates a Notification instance when a Connection changes from 'pending' to 'accepted'.
    Note: in this case the sender of the Notification is the recipient of the Connection request, as the 
    sender of the Connection request should be notified that the other person has accepted their request.
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
    A signal which creates a Notification instance when a Recommendation instance is created.
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
