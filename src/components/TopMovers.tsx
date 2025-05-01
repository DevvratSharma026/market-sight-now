
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { useStockData } from '@/hooks/useStockData';
import { useEffect, useMemo } from 'react';
import { convertCurrency, formatCurrency } from '@/utils/currencyConverter';

const TopMovers = () => {
  const { searchStock, stocks } = useStockData();
  
  // Compute top gainers and losers from real stock data
  const { gainers, losers } = useMemo(() => {
    if (!stocks.length) {
      return { gainers: [], losers: [] };
    }
    
    // Sort stocks by change percentage
    const sortedStocks = [...stocks].sort((a, b) => {
      const changeA = parseFloat(a.change);
      const changeB = parseFloat(b.change);
      return changeB - changeA; // Descending order for gainers first
    });
    
    // Get top 5 gainers and losers
    const gainers = sortedStocks.filter(stock => parseFloat(stock.change) > 0).slice(0, 5);
    const losers = [...sortedStocks].filter(stock => parseFloat(stock.change) < 0).slice(0, 5);
    
    return { gainers, losers };
  }, [stocks]);
  
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
            {gainers.length > 0 ? (
              gainers.map((stock) => (
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
                    <div>
                      {formatCurrency(convertCurrency(parseFloat(stock.price), stock.currency || 'USD', 'INR'), 'INR')}
                      <span className="text-xs ml-1 text-slate-500">
                        ({stock.currency || '$'}{stock.price})
                      </span>
                    </div>
                    <div className="text-green-500 text-xs">{stock.changePercent}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-slate-500">Loading stock data...</div>
            )}
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
            {losers.length > 0 ? (
              losers.map((stock) => (
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
                    <div>
                      {formatCurrency(convertCurrency(parseFloat(stock.price), stock.currency || 'USD', 'INR'), 'INR')}
                      <span className="text-xs ml-1 text-slate-500">
                        ({stock.currency || '$'}{stock.price})
                      </span>
                    </div>
                    <div className="text-red-500 text-xs">{stock.changePercent}</div>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-2 text-slate-500">Loading stock data...</div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TopMovers;
