from django.contrib import admin
from .models import WorkShare, Profile, Post, JobListing, Comment

class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')
    
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'about', 'image', 'experience')
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('title', 'content', 'image', 'comments', 'likes', 'author')

class JobListingAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'remote', 'job_type', 'image', 'comments', 'likes', 'salary', 'location', 'status', 'author')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'author')

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)



