import React from 'react';
import { ScatterChart, Scatter, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface CorrelationChartProps {
  data: [number, number][];
}

const CorrelationChart: React.FC<CorrelationChartProps> = ({ data }) => {
  const chartData = data.map(([score, comments]) => ({ score, comments }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <ScatterChart>
          <XAxis type="number" dataKey="score" name="Score" />
          <YAxis type="number" dataKey="comments" name="Comments" />
          <Tooltip />
          <Scatter data={chartData} className="fill-green-500" />
        </ScatterChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CorrelationChart;