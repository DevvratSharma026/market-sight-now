
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockData } from '../context/StockDataContext';

const TopMovers = () => {
  const { searchStock } = useStockData();
  
  const gainers = [
    { symbol: 'NVDA', name: 'NVIDIA Corp', price: '925.17', change: '+3.42%' },
    { symbol: 'AMD', name: 'Advanced Micro Devices', price: '164.82', change: '+2.78%' },
    { symbol: 'TSLA', name: 'Tesla Inc', price: '172.63', change: '+2.45%' },
    { symbol: 'AAPL', name: 'Apple Inc', price: '178.72', change: '+1.83%' },
    { symbol: 'MSFT', name: 'Microsoft Corp', price: '425.22', change: '+1.56%' }
  ];
  
  const losers = [
    { symbol: 'META', name: 'Meta Platforms', price: '472.24', change: '-2.35%' },
    { symbol: 'DIS', name: 'Walt Disney Co', price: '114.22', change: '-1.92%' },
    { symbol: 'NFLX', name: 'Netflix Inc', price: '602.51', change: '-1.78%' },
    { symbol: 'AMZN', name: 'Amazon.com Inc', price: '182.41', change: '-1.53%' },
    { symbol: 'GOOG', name: 'Alphabet Inc', price: '164.56', change: '-1.24%' }
  ];
  
  const handleClickStock = (symbol: string) => {
    searchStock(symbol);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <TrendingUp className="h-5 w-5 mr-2 text-green-500" />
            <h3 className="text-lg font-medium">Top Gainers</h3>
          </div>
          <div className="space-y-3">
            {gainers.map((stock) => (
              <div 
                key={stock.symbol}
                className="flex justify-between items-center p-2 hover:bg-slate-100 rounded-md cursor-pointer dark:hover:bg-slate-800"
                onClick={() => handleClickStock(stock.symbol)}
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-slate-500">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div>${stock.price}</div>
                  <div className="text-green-500 text-xs">{stock.change}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <div className="flex items-center mb-4">
            <TrendingDown className="h-5 w-5 mr-2 text-red-500" />
            <h3 className="text-lg font-medium">Top Losers</h3>
          </div>
          <div className="space-y-3">
            {losers.map((stock) => (
              <div 
                key={stock.symbol}
                className="flex justify-between items-center p-2 hover:bg-slate-100 rounded-md cursor-pointer dark:hover:bg-slate-800"
                onClick={() => handleClickStock(stock.symbol)}
              >
                <div>
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-slate-500">{stock.name}</div>
                </div>
                <div className="text-right">
                  <div>${stock.price}</div>
                  <div className="text-red-500 text-xs">{stock.change}</div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopMovers;
