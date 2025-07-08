# analytics/views.py
from collections import Counter
from rest_framework.views import APIView
from rest_framework.response import Response
from .services import fetch_top_stories, get_score_comment_pairs
from .trending import get_trending_topics

class RawStories(APIView):
    def get(self, _): return Response(fetch_top_stories())

class Insights(APIView):
    def get(self, _):
        data = fetch_top_stories()
        kw = [kw for s in data for kw in s['keywords']]
        dom = [s['domain'] for s in data]
        return Response({'keyword_freq': Counter(kw), 'top_domains': Counter(dom).most_common(10)})

class TrendingTopics(APIView):
    def get(self, _): return Response({'trending': get_trending_topics()})

class ScoreComments(APIView):
    def get(self, _): return Response({'pairs': get_score_comment_pairs()})