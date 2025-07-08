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
    resp = client.get(url)
    print("Sample API /api/stories/ response:", resp.json()[0] if resp.json() else None)
    assert resp.status_code == 200
    assert isinstance(resp.json(), list)

@pytest.mark.django_db
def test_trending_endpoint(client):
    url = '/api/trending/'
    resp = client.get(url)
    data = resp.json()
    print("Sample API /api/trending/ response:", data)
    assert resp.status_code == 200
    assert 'trending' in data and isinstance(data['trending'], list)