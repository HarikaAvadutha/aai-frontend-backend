from django.urls import path, include
from rest_framework import routers
from .api import ArtViewSet


router = routers.DefaultRouter()
router.register('art', ArtViewSet, 'art')

urlpatterns = router.urls
