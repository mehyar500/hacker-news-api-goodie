# analytics/trending.py
import re
from collections import Counter
from .services import fetch_top_stories

STOP = {'the','and','for','with','from','using'}

def get_trending_topics():
    titles = [s['title'].lower() for s in fetch_top_stories()]
    words = re.findall(r"\w+", ' '.join(titles))
    filtered = [w for w in words if w not in STOP and len(w)>3]
    return Counter(filtered).most_common(10)