# analytics/management/commands/fetch_stories.py
import requests
from urllib.parse import urlparse
from django.core.management.base import BaseCommand
from analytics.models import Story
from datetime import datetime

KEYWORDS = ['chatgpt','claude','anthropic','gpt','llm']

class Command(BaseCommand):
    help = 'Fetch top 50 HN stories and save to DB'

    def handle(self, *args, **options):
        top_ids = requests.get('https://hacker-news.firebaseio.com/v0/topstories.json').json()[:50]
        for hid in top_ids:
            data = requests.get(f'https://hacker-news.firebaseio.com/v0/item/{hid}.json').json() or {}
            story, _ = Story.objects.update_or_create(
                hn_id=hid,
                defaults={
                    'title': data.get('title',''),
                    'url': data.get('url'),
                    'time': datetime.fromtimestamp(data.get('time',0)),
                    'score': data.get('score',0),
                    'descendants': data.get('descendants',0),
                    'by': data.get('by',''),
                    'domain': urlparse(data.get('url','')).netloc,
                    'keywords': [kw for kw in KEYWORDS if kw in data.get('title','').lower()]
                }
            )
            self.stdout.write(f"Saved story {story.hn_id}")