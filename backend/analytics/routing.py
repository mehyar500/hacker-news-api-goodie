# analytics/routing.py
from django.urls import re_path
from .consumers import StoriesConsumer

websocket_urlpatterns=[re_path(r'ws/stories/$',StoriesConsumer.as_asgi())]