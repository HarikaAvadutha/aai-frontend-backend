from django.urls import path, include
from .views import FileViewSet
from rest_framework import routers

router = routers.DefaultRouter()

router.register('analytics', FileViewSet, 'analytics')

urlpatterns=router.urls