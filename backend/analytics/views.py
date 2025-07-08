# analytics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from collections import Counter
from .services import fetch_top_stories,get_trending_topics,get_score_comment_pairs

class RawStories(APIView):
    def get(self, _): return Response(fetch_top_stories())

class Insights(APIView):
    def get(self, _):
        data=fetch_top_stories()
        kw=[k for s in data for k in s['keywords']]
        dom=[s['domain'] for s in data if s['domain']]
        return Response({'keyword_freq':Counter(kw),'top_domains':Counter(dom).most_common(10)})

class TrendingTopics(APIView):
    def get(self, _): return Response({'trending':get_trending_topics()})

class Correlation(APIView):
    def get(self,_): return Response({'pairs':get_score_comment_pairs()})