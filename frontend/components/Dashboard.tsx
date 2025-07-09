import React, { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import api from '../utils/api';
import { Insights, Story } from '../@types';
import Chart from './Chart';

// ===== TRENDING TAGS COMPONENT =====

const TrendingTags: React.FC<{ tags: [string, number][] }> = ({ tags }) => (
  <div className="flex flex-wrap gap-3 justify-center">
    {tags.map(([tag, count], i) => (
      <motion.span
        key={tag}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: i * 0.1 }}
        className="px-5 py-2 bg-gradient-to-r from-pink-400 to-purple-600 text-white rounded-full font-semibold shadow-md hover:shadow-lg transition-shadow"
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

  // Format data for charts
  const { keywordData, domainData, correlationData } = useMemo(() => {
    if (!insights) return { keywordData: [], domainData: [], correlationData: [] };

    const keywordData = Object.entries(insights.keyword_freq || {})
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 10);

    const domainData = (insights.top_domains || [])
      .map(([name, value]) => ({
        name: name.replace('www.', '').replace('.com', '').replace('.org', '').replace('.net', ''),
        value,
      }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 8);

    const correlationData = (insights.pairs || [])
      .filter(([score, comments]) => score <= 1000 && comments <= 500)
      .map(([score, comments]) => ({
        score,
        comments,
        value: Math.sqrt(score * comments), // For bubble size in scatter plot
      }));

    return { keywordData, domainData, correlationData };
  }, [insights]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Fetch all data in parallel
        const [storiesRes, insightsRes, trendingRes, correlationRes] = await Promise.all([
          api.get('/stories/'),
          api.get('/insights/'),
          api.get('/trending/'),
          api.get('/correlation/')
        ]);

        console.log(storiesRes.data, insightsRes.data, trendingRes.data, correlationRes.data);

        setInsights({
          keyword_freq: insightsRes.data.keyword_freq || {},
          top_domains: insightsRes.data.top_domains || [],
          trending: trendingRes.data.trending || [],
          pairs: correlationRes.data.pairs || [],
        });
        
        // Transform stories to match our frontend type
        const formattedStories = (storiesRes.data || []).map((story: {
          id: number;
          title: string;
          url?: string;
          by: string;
          score: number;
          descendants: number;
          keywords?: string[];
        }) => ({
          id: story.id,
          title: story.title,
          url: story.url,
          by: story.by,
          score: story.score,
          descendants: story.descendants,
          keywords: story.keywords || []
        }));
        
        setStories(formattedStories);
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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">Hacker News Dashboard</h1>
          
          <div className="bg-red-100 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-6 py-4 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-xl font-semibold mb-2">Connection Error</h3>
            <p className="mb-4">{error}</p>
            

            
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Make sure the backend server is running at {process.env.NEXT_PUBLIC_API_BASE?.replace('/v0', '') || 'http://localhost:8000'}
            </p>
            
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-800 rounded-md">
              <h4 className="font-medium mb-2">Troubleshooting:</h4>
              <ul className="list-disc pl-5 space-y-1 text-sm">
                <li>Check if the backend server is running</li>
                <li>Verify the API URL in your environment variables</li>
                <li>Check the browser&apos;s developer console for detailed error messages</li>
              </ul>
              
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/50 dark:hover:bg-blue-800/50 rounded-md text-blue-800 dark:text-blue-200 text-sm font-medium transition-colors"
              >
                Retry Loading Data
              </button>
            </div>
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
        <Chart
          type="bar"
          data={keywordData}
          xKey="name"
          yKey="value"
          dataKey="value"
          title="Top Keywords"
          description="Most frequently mentioned keywords in story titles"
          className="h-80"
        />

        <Chart
          type="pie"
          data={domainData}
          dataKey="value"
          nameKey="name"
          title="Top Domains"
          description="Most common domains of shared stories"
          className="h-80"
        />

        <Chart
          type="scatter"
          data={correlationData}
          xKey="score"
          yKey="comments"
          dataKey="value"
          title="Score vs Comments"
          description="Relationship between story scores and comment counts"
          className="h-80"
        />
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
