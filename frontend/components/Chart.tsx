import React from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip as RechartsTooltip,
  Legend,
  ResponsiveContainer,
  ScatterChart,
  Scatter,
} from 'recharts';
import { motion } from 'framer-motion';

type ChartType = 'bar' | 'pie' | 'scatter';

interface ChartProps {
  type: ChartType;
  data: Record<string, unknown>[];
  xKey?: string;
  yKey?: string;
  dataKey?: string;
  nameKey?: string;
  className?: string;
  height?: number;
  colors?: string[];
  title?: string;
  description?: string;
}

const defaultColors = [
  '#6366f1', '#f472b6', '#fbbf24', '#34d399', '#60a5fa',
  '#f87171', '#a78bfa', '#facc15', '#38bdf8', '#f97316',
];

const Chart: React.FC<ChartProps> = ({
  type,
  data,
  xKey = 'x',
  yKey = 'y',
  dataKey = 'value',
  nameKey = 'name',
  className = '',
  height = 300,
  colors = defaultColors,
  title,
  description,
}) => {
  if (!data || data.length === 0) {
    return (
      <div className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg ${className}`}>
        <div className="text-center text-gray-500 py-8">No data available</div>
      </div>
    );
  }

  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <BarChart data={data}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" vertical={false} />
              <XAxis
                dataKey={xKey}
                tick={{ fontSize: 12, fill: '#6b7280' }}
                angle={-30}
                textAnchor="end"
                height={50}
              />
              <YAxis
                tick={{ fontSize: 12, fill: '#6b7280' }}
                domain={[0, 'auto']}
                allowDecimals={false}
                width={40}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                wrapperClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !p-3"
              />
              <Bar
                dataKey={dataKey}
                radius={[6, 6, 0, 0]}
                className="fill-indigo-500 hover:fill-indigo-600 transition-colors"
              >
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    className="hover:opacity-80 transition-opacity"
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <div className="relative" style={{ height }}>
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  dataKey={dataKey}
                  nameKey={nameKey}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  label={renderPieLabel}
                >
                  {data.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={colors[index % colors.length]}
                      stroke="#ffffff"
                      strokeWidth={1}
                    />
                  ))}
                </Pie>
                <RechartsTooltip
                  content={<CustomTooltip />}
                  wrapperClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !p-3"
                />
                <Legend
                  layout="horizontal"
                  verticalAlign="bottom"
                  height={40}
                  iconType="circle"
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        );

      case 'scatter':
        return (
          <ResponsiveContainer width="100%" height={height}>
            <ScatterChart
              margin={{
                top: 20,
                right: 20,
                bottom: 20,
                left: 20,
              }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e7ef" />
              <XAxis
                type="number"
                dataKey={xKey}
                name="Score"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <YAxis
                type="number"
                dataKey={yKey}
                name="Comments"
                tick={{ fontSize: 12, fill: '#6b7280' }}
              />
              <RechartsTooltip
                content={<CustomTooltip />}
                wrapperClassName="!bg-white !border !border-gray-200 !rounded-lg !shadow-lg !p-3"
              />
              <Scatter name="Stories" data={data}>
                {data.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={colors[index % colors.length]}
                    className="opacity-70 hover:opacity-100 transition-opacity"
                  />
                ))}
              </Scatter>
            </ScatterChart>
          </ResponsiveContainer>
        );

      default:
        return null;
    }
  };

  // Type for the pie label render function
  type PieLabelRenderProps = {
    cx: number;
    cy: number;
    midAngle: number;
    innerRadius: number;
    outerRadius: number;
    percent: number;
    index: number;
    name: string;
    value: number;
  };

  const renderPieLabel = (props: Partial<PieLabelRenderProps>): React.ReactNode => {
    if (!props.cx || !props.cy || !props.midAngle || !props.innerRadius || 
        !props.outerRadius || props.percent === undefined) {
      return null;
    }
    
    const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props;
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null;

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  interface TooltipEntry {
    name: string;
    value: number | string;
    color: string;
  }

  const CustomTooltip = ({
    active,
    payload,
    label,
  }: {
    active?: boolean;
    payload?: { name: string; value: number | string; color: string }[];
    label?: string;
  }) => {
    if (!active || !payload || payload.length === 0) return null;

    return (
      <div className="text-sm bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        {label && <p className="font-semibold mb-1">{label}</p>}
        {payload.map((entry: TooltipEntry, index: number) => (
          <p key={`tooltip-${index}`} style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow ${className}`}
    >
      {title && (
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {title}
          </h3>
          {description && (
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {description}
            </p>
          )}
        </div>
      )}
      <div className={title ? 'mt-2' : ''}>{renderChart()}</div>
    </motion.div>
  );
};

export default Chart;
