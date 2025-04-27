
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStockData } from '../context/StockDataContext';

interface StockChartProps {
  timeframe: string;
}

const StockChart = ({ timeframe }: StockChartProps) => {
  const { currentStock, chartData } = useStockData();
  const [data, setData] = useState<any[]>([]);
  
  // Simulate data based on timeframe
  useEffect(() => {
    setData(chartData);
  }, [timeframe, chartData]);

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={data}
        margin={{ top: 10, right: 0, left: 0, bottom: 0 }}
      >
        <defs>
          <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor="#4F46E5" stopOpacity={0.3} />
            <stop offset="95%" stopColor="#4F46E5" stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
        <XAxis 
          dataKey="time" 
          axisLine={false} 
          tickLine={false} 
          tickMargin={10}
          tickFormatter={(value) => {
            if (timeframe === '1D') {
              return value.toString();
            }
            return value.toString();
          }}
        />
        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']}
          axisLine={false} 
          tickLine={false} 
          tickMargin={10}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value: number) => [`$${value.toFixed(2)}`, 'Price']}
          labelFormatter={(label) => `Time: ${label}`}
        />
        <Area 
          type="monotone" 
          dataKey="price" 
          stroke="#4F46E5" 
          fill="url(#chartGradient)" 
          strokeWidth={2}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default StockChart;
