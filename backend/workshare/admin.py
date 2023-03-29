from django.contrib import admin
from .models import WorkShare, Profile, Post, JobListing, Comment, DirectMessage, Conversation

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

class DirectMessagingAdmin(admin.ModelAdmin):
    list_display = ('sender', 'receiver', 'timestamp', 'content')

class ConversationAdmin(admin.ModelAdmin):
     list_display = ('id', 'get_participants')

     def get_participants(self, obj):
            return ', '.join([p.username for p in obj.participants.all()])
     get_participants.short_description = 'Participants'
# Register your models here.




admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(Post, PostAdmin)
admin.site.register(JobListing, JobListingAdmin)
admin.site.register(Comment, CommentAdmin)
admin.site.register(DirectMessage, DirectMessagingAdmin)
admin.site.register(Conversation, ConversationAdmin)
