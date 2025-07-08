import React from 'react';
import { PieChart, Pie, Tooltip, Cell, ResponsiveContainer, Legend } from 'recharts';

interface DomainChartProps {
  data: [string, number][];
}

const COLORS = ['#6366f1', '#f472b6', '#fbbf24', '#34d399', '#60a5fa', '#f87171', '#a78bfa', '#facc15', '#38bdf8', '#f472b6'];

const DomainChart: React.FC<DomainChartProps> = ({ data }) => {
  const chartData = data.map(([name, value]) => ({ name, value }));

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
            {chartData.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip wrapperClassName="!rounded-lg !shadow-lg !bg-white !text-black" />
          <Legend verticalAlign="bottom" height={36} iconType="circle"/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DomainChart;