
import { useState, useEffect } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useStockData } from '@/hooks/useStockData';
import { generateChartData } from '@/utils/stockDataUtils';
import { convertCurrency, formatCurrency } from '@/utils/currencyConverter';

interface StockChartProps {
  timeframe: string;
}

const StockChart = ({ timeframe }: StockChartProps) => {
  const { currentStock } = useStockData();
  const [data, setData] = useState<any[]>([]);
  
  // Generate chart data based on timeframe
  useEffect(() => {
    const rawData = generateChartData(currentStock.price, timeframe);
    
    // Convert all prices to INR
    const convertedData = rawData.map(point => ({
      ...point,
      price: convertCurrency(
        point.price, 
        currentStock.currency || 'USD', 
        'INR'
      ),
      originalPrice: point.price, // Keep the original price for reference
      originalCurrency: currentStock.currency || 'USD'
    }));
    
    setData(convertedData);
  }, [timeframe, currentStock.price, currentStock.symbol, currentStock.currency]);

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
          tickFormatter={(value) => value.toString()}
        />
        <YAxis 
          domain={['dataMin - 5', 'dataMax + 5']}
          axisLine={false} 
          tickLine={false} 
          tickMargin={10}
          tickFormatter={(value) => `₹${value.toFixed(0)}`}
        />
        <Tooltip 
          formatter={(value: number) => [formatCurrency(value, 'INR'), 'Price']}
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
