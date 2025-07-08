# analytics/services.py
import requests
from django.core.cache import cache
from urllib.parse import urlparse
from datetime import datetime
from .models import Story

CACHE_KEY = 'top_50'
CACHE_TTL = 300
KEYWORDS = ['chatgpt','claude','anthropic','gpt','llm']

HN_TOP = 'https://hacker-news.firebaseio.com/v0/topstories.json'
HN_ITEM = 'https://hacker-news.firebaseio.com/v0/item/{id}.json'

def fetch_top_stories():
    if (stories := cache.get(CACHE_KEY)):
        return stories
    ids = requests.get(HN_TOP).json()[:50]
    stories = []
    for sid in ids:
        data = requests.get(HN_ITEM.format(id=sid)).json() or {}
        story = Story(
            id=sid,
            title=data.get('title',''),
            url=data.get('url'),
            time=datetime.fromtimestamp(data.get('time',0)),
            score=data.get('score',0),
            descendants=data.get('descendants',0),
            by=data.get('by',''),
            domain=urlparse(data.get('url','')).netloc,
            keywords=[kw for kw in KEYWORDS if kw in data.get('title','').lower()]
        ).dict()
        stories.append(story)
    cache.set(CACHE_KEY, stories, CACHE_TTL)
    return stories

def get_score_comment_pairs():
    return [(s['score'], s['descendants']) for s in fetch_top_stories()]