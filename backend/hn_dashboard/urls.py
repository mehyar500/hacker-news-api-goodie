# hn_dashboard/urls.py
from django.urls import path
from drf_spectacular.views import SpectacularAPIView,SpectacularSwaggerView
from analytics.views import RawStories,Insights,TrendingTopics,Correlation

# DRF-based views, clear endpoints, auto-generated docs.
urlpatterns=[
  path('v0/schema/',SpectacularAPIView.as_view(),name='schema'),
  path('v0/docs/',SpectacularSwaggerView.as_view(url_name='schema'),name='swagger-ui'),
  path('v0/stories/',RawStories.as_view()),
  path('v0/insights/',Insights.as_view()),
  path('v0/trending/',TrendingTopics.as_view()),
  path('v0/correlation/',Correlation.as_view()),
]