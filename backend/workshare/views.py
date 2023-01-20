from django.shortcuts import render
from rest_framework import viewsets
from .serializers import WorkShareSerializer
from .models import WorkShare


class WorkShareView(viewsets.ModelViewSet):
    serializer_class = WorkShareSerializer
    queryset = WorkShare.objects.all()