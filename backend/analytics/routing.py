# analytics/routing.py
from django.urls import re_path
from .consumers import StoriesConsumer

# simple push of cached data on request
websocket_urlpatterns=[re_path(r'ws/stories/$',StoriesConsumer.as_asgi())]