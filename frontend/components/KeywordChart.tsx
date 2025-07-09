import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KeywordChartProps {
  data: Record<string, number>;
}

const KeywordChart: React.FC<KeywordChartProps> = ({ data }) => {
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
          <Tooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#kw-gradient)" minPointSize={10} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordChart;