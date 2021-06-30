from art.models import Art
from rest_framework import viewsets, permissions, generics
from .serializers import ArtSerializer

# Art viewset

class ArtViewSet(viewsets.ModelViewSet):
  serializer_class = ArtSerializer
  queryset = Art.objects.all()
  permission_classes = [
    permissions.AllowAny
  ]