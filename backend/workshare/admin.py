from django.contrib import admin
from .models import WorkShare, Profile, Post, JobListing, Comment, Notification

class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')
    
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'about', 'image', 'experience')
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'content', 'image', 'likes', 'author', 'created_at')

class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'description', 'remote', 'job_type', 'image', 'likes', 'salary', 'location', 'status', 'author')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'author', 'created_at')

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'title', 'content', 'type', 'unread', 'created_at', 'content_type', 'object_id', 'content_object')

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Notification, NotificationAdmin)
