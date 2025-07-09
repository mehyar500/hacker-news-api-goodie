// pages/index.tsx
import React, { useState } from 'react';
import api from '../utils/api';
import KeywordChart from '../components/KeywordChart';
import DomainChart from '../components/DomainChart';
import CorrelationChart from '../components/CorrelationChart';
import { FaRegSun, FaRegMoon, FaStar, FaRegStar, FaSyncAlt } from 'react-icons/fa';

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

const emojiAvatars = ['🦄','🦊','🐸','🐼','🐧','🐨','🐯','🦁','🐵','🐻','🐶','🐱','🦉','🦋','🦕','🦖','🦩','🦜','🦚','🦔'];

const getAvatar = (author: string) => {
  let hash = 0;
  for (let i = 0; i < author.length; i++) hash = author.charCodeAt(i) + ((hash << 5) - hash);
  return emojiAvatars[Math.abs(hash) % emojiAvatars.length];
};

const Home: React.FC<HomeProps> = ({ stories, insights, trending, pairs }) => {
  const [filter, setFilter] = useState<string>('');
  const [saved, setSaved] = useState<number[]>(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('saved');
      return stored ? JSON.parse(stored) : [];
    }
    return [];
  });
  const [dark, setDark] = useState(false);

  const toggleSave = (id: number) => {
    const updated = saved.includes(id)
      ? saved.filter(x => x !== id)
      : [...saved, id];
    setSaved(updated);
    localStorage.setItem('saved', JSON.stringify(updated));
  };

  // Filter logic for keywords (case-insensitive, partial match)
  const filteredStories = stories.filter(s =>
    !filter || s.keywords.some(k => k.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <main className={
      `min-h-screen px-2 md:px-8 py-6 transition-colors duration-300 ${dark ? 'bg-neutral-950 text-neutral-100' : 'bg-neutral-50 text-neutral-900'}`
    }>
      {/* Sticky Header */}
      <header className="sticky top-0 z-30 w-full flex items-center justify-between px-2 md:px-8 py-3 mb-8 backdrop-blur-lg bg-white/60 dark:bg-neutral-900/60 shadow-lg rounded-b-2xl">
        <div className="flex items-center gap-3">
          <span className="text-2xl md:text-3xl">📰</span>
          <span className="font-extrabold text-xl md:text-2xl tracking-tight bg-gradient-to-r from-purple-500 to-pink-400 bg-clip-text text-transparent">Hacker News Dashboard</span>
        </div>
        <button
          className="rounded-full p-2 bg-gradient-to-tr from-purple-400 to-blue-500 text-white shadow-lg hover:scale-110 transition-transform text-xl"
          onClick={() => setDark(d => !d)}
          aria-label="Toggle theme"
        >
          {dark ? <FaRegSun /> : <FaRegMoon />}
        </button>
      </header>

      {/* Dashboard Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="backdrop-blur-lg bg-[var(--card)] dark:bg-[var(--card-dark)] rounded-2xl shadow-2xl p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">#️⃣ Keyword Frequency</h2>
          <KeywordChart data={insights.keyword_freq} />
        </div>
        <div className="backdrop-blur-lg bg-[var(--card)] dark:bg-[var(--card-dark)] rounded-2xl shadow-2xl p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">🌐 Top Domains</h2>
          <DomainChart data={insights.top_domains} />
        </div>
        <div className="backdrop-blur-lg bg-[var(--card)] dark:bg-[var(--card-dark)] rounded-2xl shadow-2xl p-4 flex flex-col">
          <h2 className="font-bold text-lg mb-2 flex items-center gap-2">📈 Score vs Comments</h2>
          <CorrelationChart data={pairs} />
        </div>
      </div>

      {/* Trending Topics as Chips */}
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">🔥 Trending Topics</h2>
        <div className="flex flex-wrap gap-2">
          {trending.map(([topic, count], idx) => (
            <span key={topic + '-' + count + '-' + idx} className="inline-flex items-center px-4 py-1 rounded-full bg-gradient-to-r from-pink-400 to-purple-500 text-white text-base font-bold shadow hover:scale-105 transition-transform">
              <span className="mr-2">#{topic}</span>
              <span className="bg-white/20 rounded-full px-2 py-0.5 text-xs font-extrabold">{count}</span>
            </span>
          ))}
        </div>
      </div>

      {/* Filter & Table */}
      <div className="mb-8">
        <div className="flex items-center gap-2 mb-4">
          <input
            type="text"
            placeholder="🔍 Filter by keyword..."
            className="w-full border-2 border-purple-400 focus:border-pink-500 focus:ring-2 focus:ring-pink-200 dark:bg-neutral-800 dark:border-purple-700 dark:text-white rounded-full p-3 shadow transition"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
          <button
            className="rounded-full p-3 bg-gradient-to-tr from-pink-400 to-purple-500 text-white shadow-lg hover:scale-110 transition-transform"
            onClick={() => window.location.reload()}
            aria-label="Refresh"
            title="Refresh stories"
          >
            <FaSyncAlt />
          </button>
        </div>
        <div className="overflow-x-auto rounded-2xl shadow-2xl backdrop-blur-lg bg-[var(--glass)] dark:bg-[var(--glass-dark)]">
          <table className="min-w-full text-base">
            <thead className="sticky top-0 z-10 bg-gradient-to-r from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900">
              <tr>
                <th className="p-4 text-left">Save</th>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Score</th>
                <th className="p-4 text-left">Comments</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
              {filteredStories.length === 0 && (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-neutral-400">No stories found.</td>
                </tr>
              )}
              {filteredStories.map((s, idx) => (
                <tr key={s.id ?? `${s.title}-${s.by}-${idx}`}
                  className="hover:bg-pink-50 dark:hover:bg-pink-900/40 transition">
                  <td className="p-4 text-center">
                    <button
                      onClick={() => toggleSave(s.id)}
                      className={`text-2xl transition-transform duration-200 ${saved.includes(s.id) ? 'text-yellow-400 scale-125' : 'text-neutral-400 hover:text-yellow-300 hover:scale-110'}`}
                      title={saved.includes(s.id) ? 'Unsave' : 'Save'}
                    >
                      {saved.includes(s.id) ? <FaStar /> : <FaRegStar />}
                    </button>
                  </td>
                  <td className="p-4 max-w-xs truncate">
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-purple-700 dark:text-pink-300 hover:underline font-bold"
                    >
                      {s.title}
                    </a>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {s.keywords.map((kw, kidx) => (
                        <span key={`${s.id ?? idx}-kw-${kidx}`} className="inline-block bg-[var(--chip)] dark:bg-[var(--chip-dark)] text-purple-700 dark:text-pink-200 rounded-full px-3 py-0.5 text-xs font-extrabold">
                          #{kw}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="p-4 flex items-center gap-2 font-semibold">
                    <span className="text-xl">{getAvatar(s.by)}</span>
                    <span>{s.by}</span>
                  </td>
                  <td className="p-4 font-bold text-pink-700 dark:text-pink-300">{s.score}</td>
                  <td className="p-4 font-bold text-purple-700 dark:text-purple-300">{s.descendants}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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