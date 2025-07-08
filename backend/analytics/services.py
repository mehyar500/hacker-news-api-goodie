# analytics/services.py
import re
from collections import Counter
import requests
from django.core.cache import cache
from urllib.parse import urlparse
from datetime import datetime
from .models import Story
from analytics.schemas import StorySchema

CACHE_KEY, TTL = 'top_50', 300
KEYWORDS = ['chatgpt','claude','anthropic','gpt','llm']

HN_TOP, HN_ITEM = 'https://hacker-news.firebaseio.com/v0/topstories.json','https://hacker-news.firebaseio.com/v0/item/{id}.json'

def fetch_top_stories():
    # Return cached if fresh
    if data := cache.get(CACHE_KEY): return data
    ids = requests.get(HN_TOP).json()[:50]
    results = []
    for sid in ids:
        raw = requests.get(HN_ITEM.format(id=sid)).json() or {}
        story = StorySchema(   # type validation
            id=sid,
            title=raw.get('title',''),
            url=raw.get('url'),
            time=datetime.fromtimestamp(raw.get('time',0)),
            score=raw.get('score',0),
            descendants=raw.get('descendants',0),
            by=raw.get('by',''),
            domain=urlparse(raw.get('url','')).netloc,
            keywords=[kw for kw in KEYWORDS if kw in raw.get('title','').lower()]
        ).dict()
        results.append(story)
    cache.set(CACHE_KEY, results, TTL)
    return results


def get_trending_topics():
    titles = [s['title'].lower() for s in fetch_top_stories()]
    words = re.findall(r"\w+", ' '.join(titles))
    stop={'the','and','for','with','from','using'}
    return Counter(w for w in words if w not in stop and len(w)>3).most_common(10)


def get_score_comment_pairs():
    return [(s['score'],s['descendants']) for s in fetch_top_stories()]

