import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface KeywordChartProps {
  data: Record<string, number>;
}

const KeywordChart: React.FC<KeywordChartProps> = ({ data }) => {
  const chartData = Object.entries(data).map(([keyword, count]) => ({ keyword, count }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <BarChart data={chartData} className="mx-auto">
          <XAxis dataKey="keyword" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="count" className="fill-blue-500" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default KeywordChart;