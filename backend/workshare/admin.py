from django.contrib import admin
from .models import WorkShare

class WorkShareAdmin(admin.ModelAdmin):
    list_display = ('title', 'description', 'completed')

# Register your models here.

admin.site.register(WorkShare, WorkShareAdmin)

