// pages/index.tsx
import React from 'react';
import Dashboard from '../components/Dashboard';
import { Insights, Story as ApiStory } from '../@types';
import axios from 'axios';

interface HomePageProps {
  stories: ApiStory[];
  insights: Insights;
  trending: [string, number][];
  correlation: [number, number][];
}

export const getServerSideProps = async () => {
  // fallback to localhost if the env var is missing
  const baseURL = process.env.API_BASE_URL || 'http://localhost:8000/v0';

  console.log('→ SSR using API_BASE_URL =', baseURL);

  try {
    const [storiesRes, insightsRes, trendingRes, corrRes] = await Promise.all([
      axios.get(`${baseURL}/stories/`),
      axios.get(`${baseURL}/insights/`),
      axios.get(`${baseURL}/trending/`),
      axios.get(`${baseURL}/correlation/`)
    ]);

    return {
      props: {
        stories: storiesRes.data,
        insights: insightsRes.data,
        trending: trendingRes.data.trending,
        correlation: corrRes.data.pairs
      }
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return {
      props: {
        stories: [],
        insights: { keyword_freq: {}, top_domains: [], trending: [], pairs: [] },
        trending: [],
        correlation: []
      }
    };
  }
};

const HomePage: React.FC<HomePageProps> = ({
  stories,
  insights,
  trending,
  correlation
}) => (
  <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-800">
    <main className="w-11/12 max-w-7xl mx-auto py-8 px-4">
      <Dashboard
        initialStories={stories}
        initialInsights={insights}
        initialTrending={trending}
        initialCorrelation={correlation}
      />
    </main>
  </div>
);

export default HomePage;
