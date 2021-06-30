import uuid
from django.db import models

from django.core.files.base import ContentFile
# Create your models here.

class Art(models.Model):
    id = models.UUIDField( primary_key = True,
        default = uuid.uuid4,
        editable = False)
    collectionId = models.UUIDField(blank=False)
    artist_name = models.CharField(max_length=255)
    art_title = models.TextField(blank=True)
    work_type = models.TextField(blank=True)
    media_type = models.TextField(blank=True)
    support_type = models.TextField(blank=True)
    art_width = models.DecimalField(blank=True, max_digits=12, decimal_places=2, default=0)
    art_height = models.DecimalField(blank=True, max_digits=12, decimal_places=2, default=0)
    measure_units = models.TextField(blank=True, default="inches")
    originalImage = models.ImageField(upload_to='original/')
    filelen = models.DecimalField(max_digits=12, decimal_places=2)
    blob_url = models.URLField(blank=True, max_length = 255)
    analytics=models.JSONField(editable=False, default=dict) 
    created_at = models.DateTimeField(auto_now_add=True)
    modified_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):

        super(Art, self).save(*args, **kwargs)

    def __str__(self):
        return self.title