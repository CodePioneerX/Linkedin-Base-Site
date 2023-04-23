from django.contrib import admin

from django.contrib.auth.models import User, Group
from .models import *

# initialize Document instances for use in JobListing required_docs
Document.objects.get_or_create(document_type='Resume')
Document.objects.get_or_create(document_type='Cover Letter')
Document.objects.get_or_create(document_type='Letter of Recommendation')
Document.objects.get_or_create(document_type='Portfolio')
Document.objects.get_or_create(document_type='Transcript')


Reported, created = Group.objects.get_or_create(name='Reported')

from .models import WorkShare, Profile, Post, JobListing, Comment, Chat, ChatMessage#, Conversation, DirectMessage 


class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed') 
    
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'user', 'title', 'about', 'image', 'experience')
    
class PostAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'content', 'image', 'author', 'created_at', 'reported')

class JobListingAdmin(admin.ModelAdmin):
    list_display = ('id', 'title', 'remote', 'employment_term', 'job_type', 'image', 'salary', 'salary_type', 'location', 'status', 'author', 'get_required_docs', 'created_at', 'deadline', 'listing_type')

class CommentAdmin(admin.ModelAdmin):
    list_display = ('author', 'content', 'post', 'created_at')

class NotificationAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'title', 'content', 'type', 'unread', 'created_at', 'content_type', 'object_id', 'content_object')

class ConnectionAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'status')

class RecommendationsAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient', 'description')

class DocumentAdmin(admin.ModelAdmin):
    list_display = ('id', 'document_type')

class JobAlertAdmin(admin.ModelAdmin):
    list_display = ('user', 'search_term', 'company', 'location', 'job_type', 'employment_term', 'salary_type', 'min_salary', 'max_salary', 'listing_type', 'remote')

class JobApplicationAdmin(admin.ModelAdmin):
    list_display = ('user', 'job_post')

class LikesAdmin(admin.ModelAdmin):
    list_display = ('user', 'post')

class UserReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'recipient')

class PostReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'post')

class JobReportAdmin(admin.ModelAdmin):
    list_display = ('id', 'sender', 'job')

# class DirectMessagingAdmin(admin.ModelAdmin):
#     list_display = ('sender', 'receiver', 'timestamp', 'content')

# class ConversationAdmin(admin.ModelAdmin):
#      list_display = ('id', 'get_participants')

#      def get_participants(self, obj):
#             return ', '.join([p.username for p in obj.participants.all()])
#      get_participants.short_description = 'Participants'
# # Register your models here.

# class ChatMessageInline(admin.TabularInline):
#     model = ChatMessage
#     extra = 0

# class ChatAdmin(admin.ModelAdmin):
#     inlines = [ChatMessageInline]
#     filter_horizontal = ('participants',)



admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)

admin.site.register(Notification, NotificationAdmin)
admin.site.register(Connection,ConnectionAdmin)
admin.site.register(Recommendations, RecommendationsAdmin)
admin.site.register(Document, DocumentAdmin)
admin.site.register(JobAlert, JobAlertAdmin)
admin.site.register(JobApplication, JobApplicationAdmin)
admin.site.register(Likes, LikesAdmin)
admin.site.register(UserReport, UserReportAdmin)
admin.site.register(PostReport, PostReportAdmin)
admin.site.register(JobReport, JobReportAdmin)

admin.site.register(Chat)
admin.site.register(ChatMessage)
