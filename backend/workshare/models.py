from django.db import models

# Create your models here.
class WorkShare(models.Model):
    title = models.CharField(max_length=120)
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def _str_(self):
        return self.title
    
    
class Profile(models.Model):
    name = models.CharField(max_length=255)
    title = models.CharField(max_length=255)
    about = models.TextField()
    image = models.ImageField(upload_to='images/', blank=True)
    experience = models.TextField()

    def __str__(self):
        return self.name