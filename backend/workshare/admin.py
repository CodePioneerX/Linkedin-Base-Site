from django.contrib import admin
from .models import WorkShare, Profile

class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')
    
class ProfileAdmin(admin.ModelAdmin):
    list_display = ('name', 'title', 'about', 'image', 'experience')
    

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)
admin.site.register(Profile, ProfileAdmin)

