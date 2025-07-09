import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  ScatterChart, Scatter, XAxis, YAxis, Tooltip as RechartsTooltip,
  ResponsiveContainer, CartesianGrid, BarChart, Bar, PieChart, Pie, Cell, Legend
} from 'recharts';
import api from '../utils/api';
import { Insights, Story } from '../@types';
import { MOCK_INSIGHTS, MOCK_STORIES } from '../@types/mockData';

// ===== CHART COMPONENTS =====

const KeywordChart: React.FC<{ data: Record<string, number> }> = ({ data }) => {
  const chartData = Object.entries(data).map(([keyword, count]) => ({ keyword, count }));

  if (!chartData.length) {
    return <div className="text-center text-neutral-400 py-8">No keyword data available.</div>;
  }

  return (
    <div className="w-full h-56 md:h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={chartData} className="mx-auto">
          <defs>
            <linearGradient id="kw-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
          <XAxis dataKey="keyword" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} domain={[0, 2]} allowDecimals={false} />
          <RechartsTooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#kw-gradient)" minPointSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

const DomainChart: React.FC<{ data: [string, number][] }> = ({ data }) => {
  const COLORS = ['#6366f1', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#facc15', '#38bdf8'];
  const chartData = data.map(([name, value]) => ({ name, value }));

  if (!chartData.length) {
    return <div className="text-center text-neutral-400 py-8">No domain data available.</div>;
  }

  return (
    <div className="w-full h-56 md:h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={70}
            innerRadius={30}
            label={({ name }) => name.length > 12 ? name.slice(0, 12) + '…' : name}
            isAnimationActive
          >
            {chartData.map((entry, index) => (
              <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <RechartsTooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Legend verticalAlign="bottom" height={36} iconType="circle"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

const CorrelationChart: React.FC<{ data: [number, number][] }> = ({ data }) => {
  const chartData = data.map(([score, comments]) => ({ score, comments }));

  if (!chartData.length) {
    return <div className="text-center text-neutral-400 py-8">No correlation data available.</div>;
  }

  return (
    <div className="w-full h-56 md:h-64">
      <ResponsiveContainer>
        <ScatterChart>
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
          <XAxis type="number" dataKey="score" name="Score" tick={{ fontSize: 12 }} />
          <YAxis type="number" dataKey="comments" name="Comments" tick={{ fontSize: 12 }} />
          <RechartsTooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Scatter data={chartData} fill="#34d399" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

const TrendingTags: React.FC<{ tags: [string, number][] }> = ({ tags }) => (
  <div className="flex flex-wrap gap-3 justify-center">
    {tags.map(([tag, count], i) => (
      <motion.span
        key={tag}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: i * 0.1 }}
        className="px-5 py-2 bg-gradient-to-r from-pink-400 to-purple-600 text-white rounded-full font-semibold shadow-md"
      >
        #{tag} <span className="ml-2 bg-white/20 px-2 rounded-full text-sm">{count}</span>
      </motion.span>
    ))}
  </div>
);

const StoryCard: React.FC<{ story: Story }> = ({ story }) => (
  <motion.tr 
    whileHover={{ scale: 1.01 }}
    className="border-b border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition"
  >
    <td className="p-4 max-w-xs truncate">
      <a 
        href={story.url || `https://news.ycombinator.com/item?id=${story.id}`} 
        target="_blank" 
        rel="noopener noreferrer"
        className="text-blue-600 dark:text-blue-400 hover:underline"
      >
        {story.title}
      </a>
      {story.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1 mt-1">
          {story.keywords.slice(0, 3).map(keyword => (
            <span key={keyword} className="text-xs bg-gray-100 dark:bg-gray-700 rounded-full px-2 py-0.5">
              {keyword}
            </span>
          ))}
        </div>
      )}
    </td>
    <td className="p-4 text-sm text-gray-600 dark:text-gray-300">{story.by}</td>
    <td className="p-4 text-sm font-medium">{story.score}</td>
    <td className="p-4 text-sm">{story.descendants}</td>
  </motion.tr>
);

// ===== CARD COMPONENT =====

const Card: React.FC<{ children: React.ReactNode; className?: string }> = ({ children, className = '' }) => (
  <motion.div
    whileHover={{ scale: 1.03 }}
    transition={{ type: 'spring', stiffness: 300 }}
    className={`bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 ${className}`}
  >
    {children}
  </motion.div>
);

// ===== MAIN DASHBOARD COMPONENT =====

const Dashboard: React.FC = () => {
  const [insights, setInsights] = useState<Insights | null>(null);
  const [stories, setStories] = useState<Story[]>([]);
  const [filter, setFilter] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Check if we're in development mode
        const isDevelopment = process.env.NODE_ENV === 'development';
        
        // Test backend connection first
        try {
          await api.get('', { timeout: 3000 });
          
          // If backend is reachable, fetch real data
          const [insightsRes, trendingRes, correlationRes, storiesRes] = await Promise.all([
            api.get('/insights/'),
            api.get('/trending/'),
            api.get('/correlation/'),
            api.get<Story[]>('/stories/')
          ]);

          setInsights({
            keyword_freq: insightsRes.data.keyword_freq,
            top_domains: insightsRes.data.top_domains,
            trending: trendingRes.data.trending,
            pairs: correlationRes.data.pairs,
          });
          
          setStories(storiesRes.data);
        } catch (error) {
          // In development, use mock data if backend is not available
          if (isDevelopment) {
            console.log('Using mock data for development', error);
            setInsights(MOCK_INSIGHTS);
            setStories(MOCK_STORIES);
            setError(null);
          } else {
            throw new Error(`Unable to connect to the backend server: ${error instanceof Error ? error.message : 'Unknown error'}`);
          }
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data. ' + (err instanceof Error ? err.message : 'Please try again later.'));
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredStories = stories.filter(story =>
    !filter || story.keywords.some(k => k.toLowerCase().includes(filter.toLowerCase()))
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="flex flex-col items-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-purple-500 mb-4"></div>
          <p className="text-gray-600 dark:text-gray-300">Loading dashboard data...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-20">
        <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-2xl mx-auto">
          <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
          <p className="mb-4">{error}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_BASE || 'http://localhost:8000/api'}
          </p>
          <div className="flex justify-center gap-4">
            <button 
              onClick={() => window.location.reload()} 
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition"
            >
              Retry
            </button>
            <a 
              href="https://github.com/mehyar500/hacker-news-api-goodie#readme" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition"
            >
              View Setup Instructions
            </a>
          </div>
        </div>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <main className="container mx-auto px-4 py-8">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">🔍</span> Top Keywords
          </h3>
          <KeywordChart data={insights.keyword_freq} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">🌐</span> Top Domains
          </h3>
          <DomainChart data={insights.top_domains} />
        </Card>

        <Card>
          <h3 className="text-lg font-semibold mb-3 flex items-center">
            <span className="mr-2">📊</span> Score vs Comments
          </h3>
          <CorrelationChart data={insights.pairs} />
        </Card>
      </div>

      {/* Trending Section */}
      <section className="mb-10">
        <h3 className="text-xl font-semibold mb-4 flex items-center">
          <span className="mr-2">🔥</span> Trending Topics
        </h3>
        <Card>
          <TrendingTags tags={insights.trending} />
        </Card>
      </section>

      {/* Stories Section */}
      <section>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
          <h3 className="text-xl font-semibold mb-4 md:mb-0 flex items-center">
            <span className="mr-2">📰</span> Top Stories
          </h3>
          <div className="w-full md:w-64">
            <input
              type="text"
              placeholder="Filter by keyword..."
              className="w-full p-3 rounded-full border border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
              value={filter}
              onChange={e => setFilter(e.target.value)}
            />
          </div>
        </div>

        <Card>
          <div className="overflow-x-auto">
            <table className="min-w-full">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-4 text-left">Title</th>
                  <th className="p-4 text-left">Author</th>
                  <th className="p-4 text-left">Score</th>
                  <th className="p-4 text-left">Comments</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
                {filteredStories.map(story => (
                  <StoryCard key={story.id} story={story} />
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </section>
    </main>
  );
};

export default Dashboard;
