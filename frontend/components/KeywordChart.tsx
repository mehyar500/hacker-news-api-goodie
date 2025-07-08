import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface KeywordChartProps {
  data: Record<string, number>;
}

const KeywordChart: React.FC<KeywordChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([keyword, count]) => ({ keyword, count }));

  return (
    <div className="w-full h-56 md:h-64">
      <ResponsiveContainer>
        <BarChart data={chartData} className="mx-auto">
          <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
          <XAxis dataKey="keyword" tick={{ fontSize: 12 }} angle={-20} textAnchor="end" height={50} />
          <YAxis tick={{ fontSize: 12 }} />
          <Tooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Bar dataKey="count" radius={[6, 6, 0, 0]} fill="url(#kw-gradient)" />
          <defs>
            <linearGradient id="kw-gradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366f1" />
              <stop offset="100%" stopColor="#f472b6" />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordChart;