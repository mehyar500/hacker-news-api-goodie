# analytics/tests/test_services.py
import pytest
from analytics.services import fetch_top_stories, get_score_comment_pairs

@pytest.mark.django_db
def test_fetch_top_stories_returns_list():
    data = fetch_top_stories()
    assert isinstance(data, list)
    assert all('hn_id' in s for s in data)

@pytest.mark.django_db
def test_correlation_pairs_format():
    pairs = get_score_comment_pairs()
    assert isinstance(pairs, list)
    assert all(isinstance(x, tuple) and len(x) == 2 for x in pairs)