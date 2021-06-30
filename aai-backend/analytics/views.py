from django.shortcuts import render
from rest_framework import viewsets, permissions
from rest_framework import status
from .serializers import FileSerializer
from .models import File

class FileViewSet(viewsets.ModelViewSet):
  queryset = File.objects.all()
  permission_classes = [
    permissions.AllowAny
  ]
  serializer_class = FileSerializer