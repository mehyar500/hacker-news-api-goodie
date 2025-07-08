# analytics/tests/test_views.py
import pytest
from rest_framework.test import APIClient
from django.urls import reverse

@pytest.fixture
def client():
    return APIClient()

@pytest.mark.django_db
def test_raw_stories_endpoint(client):
    # Use direct path or reverse() if URL names are defined
    url = '/api/stories/'
    # url = reverse('raw-stories')
    resp = client.get(url)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.django_db
def test_trending_endpoint(client):
    url = '/api/trending/'
    # url = reverse('trending-topics')
    resp = client.get(url)
    assert resp.status_code == 200
    data = resp.json()
    assert 'trending' in data and isinstance(data['trending'], list)