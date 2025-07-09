import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

interface CorrelationChartProps {
  data: [number, number][];
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({ data }) => {
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
          <Tooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Scatter data={chartData} fill="#34d399" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationChart;