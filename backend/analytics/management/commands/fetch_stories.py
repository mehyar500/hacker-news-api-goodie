# analytics/management/commands/fetch_stories.py
from django.core.management.base import BaseCommand
from analytics.services import fetch_top_stories

class Command(BaseCommand):
    help='Fetch & cache top stories'
    def handle(self,*_,**__):
        n=len(fetch_top_stories())
        self.stdout.write(self.style.SUCCESS(f'Cached {n} stories'))