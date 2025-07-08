# hn_dashboard/urls.py
from django.urls import path
from drf_spectacular.views import SpectacularAPIView,SpectacularSwaggerView
from analytics.views import RawStories,Insights,TrendingTopics,Correlation

urlpatterns=[
  path('api/schema/',SpectacularAPIView.as_view(),name='schema'),
  path('api/docs/',SpectacularSwaggerView.as_view(url_name='schema'),name='swagger-ui'),
  path('api/stories/',RawStories.as_view()),
  path('api/insights/',Insights.as_view()),
  path('api/trending/',TrendingTopics.as_view()),
  path('api/correlation/',Correlation.as_view()),
]