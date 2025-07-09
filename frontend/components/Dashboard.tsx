// components/Dashboard.tsx
import React, { useState, useMemo, useCallback } from 'react';
import { Insights, Story as ApiStory } from '../@types';
import Chart from './Chart';

interface DashboardProps {
  initialStories: ApiStory[];
  initialInsights: Insights;
  initialTrending: [string, number][];
  initialCorrelation: [number, number][];
}

const Dashboard: React.FC<DashboardProps> = ({
  initialStories,
  initialInsights,
  initialTrending,
  initialCorrelation,
}) => {
  // Data from SSR
  const [stories] = useState<ApiStory[]>(initialStories);
  const [insights] = useState<Insights>(initialInsights);
  const [filter, setFilter] = useState('');

  // Saved stories via localStorage
  const [savedStories, setSavedStories] = useState<ApiStory[]>(() => {
    try {
      const saved = localStorage.getItem('savedStories');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Persist savedStories
  React.useEffect(() => {
    localStorage.setItem('savedStories', JSON.stringify(savedStories));
  }, [savedStories]);

  const isStorySaved = useCallback(
    (key?: string) => savedStories.some(s => s.key === key),
    [savedStories]
  );

  const handleToggleSave = useCallback((story: ApiStory) => {
    setSavedStories(prev => {
      const exists = prev.some(s => s.key === story.key);
      if (exists) return prev.filter(s => s.key !== story.key);
      return [...prev, story];
    });
  }, []);

  // Prepare chart data
  const { keywordData, domainData, correlationData } = useMemo(() => {
    const kd = Object.entries(insights.keyword_freq).map(([name, value]) => ({ name, value }));
    const dd = insights.top_domains.map(([name, value]) => ({ name, value }));
    const cd = initialCorrelation.map(([score, comments]) => ({
      score,
      comments,
      value: Math.sqrt(score * comments),
    }));
    return {
      keywordData: kd,
      domainData: dd,
      correlationData: cd,
    };
  }, [insights, initialCorrelation]);

  // Filtered list
  const filteredStories = stories.filter(story =>
    !filter || story.keywords.some(k => k.toLowerCase().includes(filter.toLowerCase()))
  );

  return (
    <div className="space-y-8">
      {/* Charts */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Chart
          type="bar"
          data={keywordData}
          xKey="name"
          yKey="value"
          dataKey="value"
          title="Top Keywords"
          description="Most frequent AI-related keywords"
          className="h-80"
        />
        <Chart
          type="pie"
          data={domainData}
          nameKey="name"
          dataKey="value"
          title="Top Domains"
          description="Most linked domains"
          className="h-80"
        />
        <Chart
          type="scatter"
          data={correlationData}
          xKey="score"
          yKey="comments"
          dataKey="value"
          title="Score vs Comments"
          description="Engagement correlation"
          className="h-80"
        />
      </div>

      {/* Trending */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          🔥 Trending Topics
        </h3>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6">
          <div className="flex flex-wrap gap-3 justify-center">
            {initialTrending.map(([tag, count]) => (
              <span
                key={tag}
                className="px-5 py-2 bg-gradient-to-r from-pink-400 to-purple-600 text-white rounded-full font-semibold shadow-md"
              >
                #{tag} <span className="ml-2 bg-white/20 px-2 rounded-full text-sm">{count}</span>
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* Stories table */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start mb-4">
          <h3 className="text-xl font-semibold mb-4 md:mb-0 flex items-center">
            📰 Top Stories
          </h3>
          <input
            type="text"
            placeholder="Filter by keyword..."
            className="w-full md:w-64 p-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            value={filter}
            onChange={e => setFilter(e.target.value)}
          />
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 overflow-x-auto">
          <table className="min-w-full">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-4 text-left">Title</th>
                <th className="p-4 text-left">Author</th>
                <th className="p-4 text-left">Score</th>
                <th className="p-4 text-left">Comments</th>
                <th className="p-4 text-left">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredStories.map(story => {
                const saved = isStorySaved(story.key);
                return (
                  <tr key={story.key} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="p-4 max-w-xs truncate">
                      <a
                        href={story.url || `https://news.ycombinator.com/item?id=${story.hn_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 dark:text-blue-400 hover:underline"
                      >
                        {story.title}
                      </a>
                    </td>
                    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{story.by}</td>
                    <td className="p-4 text-sm font-medium">{story.score}</td>
                    <td className="p-4 text-sm">{story.descendants}</td>
                    <td className="p-4">
                      <button
                        onClick={() => handleToggleSave(story)}
                        className={`px-3 py-1 rounded-md text-sm font-medium ${
                          saved
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
                        }`}
                      >
                        {saved ? '✓ Saved' : 'Save'}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
