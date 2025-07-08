# analytics/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from collections import Counter
from .services import fetch_top_stories, get_score_comment_pairs
import logging

logger = logging.getLogger(__name__)

class RawStories(APIView):
    def get(self, _):
        try:
            return Response(fetch_top_stories())
        except Exception as e:
            logger.error(f"Error in RawStories: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Insights(APIView):
    def get(self, _):
        try:
            data = fetch_top_stories()
            kw = [k for s in data for k in s['keywords']]
            dom = [s['domain'] for s in data if s['domain']]
            return Response({'keyword_freq': Counter(kw), 'top_domains': Counter(dom).most_common(10)})
        except Exception as e:
            logger.error(f"Error in Insights: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class TrendingTopics(APIView):
    def get(self, _):
        try:
            data = fetch_top_stories()
            titles = [s['title'].lower() for s in data]
            words = __import__('re').findall(r"\w+", ' '.join(titles))
            stop = {'the','and','for','with','from','using'}
            trending = Counter(w for w in words if w not in stop and len(w)>3).most_common(10)
            return Response({'trending': trending})
        except Exception as e:
            logger.error(f"Error in TrendingTopics: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

class Correlation(APIView):
    def get(self, _):
        try:
            return Response({'pairs': get_score_comment_pairs()})
        except Exception as e:
            logger.error(f"Error in Correlation: {e}")
            return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)