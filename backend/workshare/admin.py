from django.contrib import admin
from .models import WorkShare, Profile, Post, JobListing, Comment, Connection, Recommendations

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

class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'status')

class RecommendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'description')

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Connection,ConnectionAdmin)
admin.site.register(Recommendations, RecommendationsAdmin)
