from rest_framework import serializers
from art.models import Art

# File Serializer
class ArtSerializer(serializers.ModelSerializer):
  class Meta:
    model = Art
    fields = '__all__'
    