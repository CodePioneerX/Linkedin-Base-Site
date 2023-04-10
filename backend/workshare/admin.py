from django.contrib import admin
from django.contrib.auth.models import User, Group
from .models import WorkShare, Profile, Post, JobListing, Comment, Connection, Recommendations, Document, UserReport

Reported, created = Group.objects.get_or_create(name='Reported')

class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')
    
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'about', 'image', 'experience')
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'content', 'image', 'likes', 'author', 'created_at')

class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'remote', 'employment_term', 'job_type', 'image', 'likes', 'salary', 'salary_type', 'location', 'status', 'author', 'get_required_docs', 'created_at', 'deadline', 'listing_type')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('content', 'author', 'created_at')

class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('sender', 'recipient', 'status')

class RecommendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'description')

class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'document_type')

class UserReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient')

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(Connection,ConnectionAdmin)
admin.site.register(Recommendations, RecommendationsAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(UserReport, UserReportAdmin)
