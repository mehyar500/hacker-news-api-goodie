// pages/index.tsx
import React from 'react';
import api from '../utils/api';
import KeywordChart from '../components/KeywordChart';
import DomainChart from '../components/DomainChart';
import CorrelationChart from '../components/CorrelationChart';

export default function Home({ stories, insights, trending, pairs }) {
  // Client-side hooks (filter, saved) go here
  return (
    <main className="p-4">
      {/* Charts and Data Explorer code as earlier */}
    </main>
  );
}

export async function getServerSideProps() {
  try {
    const [storiesRes, insightsRes, trendingRes, corrRes] = await Promise.all([
      api.get('/stories/'),
      api.get('/insights/'),
      api.get('/trending/'),
      api.get('/correlation/')
    ]);
    return {
      props: {
        stories: storiesRes.data,
        insights: insightsRes.data,
        trending: trendingRes.data.trending,
        pairs: corrRes.data.pairs,
      }
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return { props: { stories: [], insights: { keyword_freq: {}, top_domains: [] }, trending: [], pairs: [] } };
  }
}