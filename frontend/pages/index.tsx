// pages/index.tsx
import React, { useState } from 'react';
import api from '../utils/api';
import KeywordChart from '../components/KeywordChart';
import DomainChart from '../components/DomainChart';
import CorrelationChart from '../components/CorrelationChart';

interface Story {
  id: number;
  title: string;
  url?: string;
  by: string;
  score: number;
  descendants: number;
  keywords: string[];
}

interface Insights {
  keyword_freq: Record<string, number>;
  top_domains: [string, number][];
}

interface HomeProps {
  stories: Story[];
  insights: Insights;
  trending: [string, number][];
  pairs: [number, number][];
}

const Home: React.FC<HomeProps> = ({ stories, insights, trending, pairs }) => {
  const [filter, setFilter] = useState<string>('');
  const [saved, setSaved] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saved');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });

  const toggleSave = (id: number) => {
    const updated = saved.includes(id)
      ? saved.filter(x => x !== id)
      : [...saved, id];
    setSaved(updated);
    localStorage.setItem('saved', JSON.stringify(updated));
  };

  return (
    <main className="p-4">
      {/* Charts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <KeywordChart data={insights.keyword_freq} />
        <DomainChart data={insights.top_domains} />
        <CorrelationChart data={pairs} />
        {/* Trending Topics List */}
        <div className="mt-6 p-4 bg-white rounded shadow">
          <h2 className="text-xl font-semibold mb-2">Trending Topics</h2>
          <ul className="list-disc list-inside space-y-1">
            {trending.map(([topic, count]) => (
              <li key={topic} className="text-gray-700">
                {topic} <span className="text-sm text-gray-500">({count})</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Filter & Table */}
      <div className="mt-8">
        <input
          type="text"
          placeholder="Filter by keyword"
          className="w-full border p-2 rounded mb-4"
          value={filter}
          onChange={e => setFilter(e.target.value)}
        />

        <table className="min-w-full bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2">Save</th>
              <th className="p-2">Title</th>
              <th className="p-2">Author</th>
              <th className="p-2">Score</th>
              <th className="p-2">Comments</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {stories
              .filter(s => !filter || s.keywords.includes(filter))
              .map(s => (
                <tr key={s.id} className="hover:bg-gray-50">
                  <td className="p-2">
                    <button onClick={() => toggleSave(s.id)}>
                      {saved.includes(s.id) ? '★' : '☆'}
                    </button>
                  </td>
                  <td className="p-2">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline"
                    >
                      {s.title}
                    </a>
                  </td>
                  <td className="p-2">{s.by}</td>
                  <td className="p-2">{s.score}</td>
                  <td className="p-2">{s.descendants}</td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </main>
  );
};

export default Home;

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
        insights: {
          keyword_freq: insightsRes.data.keyword_freq,
          top_domains: insightsRes.data.top_domains
        },
        trending: trendingRes.data.trending,
        pairs: corrRes.data.pairs,
      }
    };
  } catch (error) {
    console.error('SSR fetch error:', error);
    return {
      props: {
        stories: [],
        insights: { keyword_freq: {}, top_domains: [] },
        trending: [],
        pairs: [],
      }
    };
  }
}