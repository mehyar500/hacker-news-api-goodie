# analytics/tasks.py
from celery import shared_task
from .services import fetch_top_stories

@shared_task
def refresh_stories():
    fetch_top_stories()
    return 'refreshed'