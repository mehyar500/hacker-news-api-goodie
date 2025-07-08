import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer } from 'recharts';

interface DomainChartProps {
  data: [string, number][];
}

const COLORS = ['#4e79a7', '#f28e2b', '#e15759', '#76b7b2', '#59a14f'];

const DomainChart: React.FC<DomainChartProps> = ({ data }) => {
  const chartData = data.map(([name, value]) => ({ name, value }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={chartData}
            dataKey="value"
            nameKey="name"
            outerRadius={80}
            label
          >
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DomainChart;