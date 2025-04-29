
import { useStockData } from '../context/StockDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const WatchlistCard = () => {
  const { watchlist, searchStock, removeFromWatchlist, stocks } = useStockData();
  const { toast } = useToast();

  // Update watchlist with latest stock data
  const updatedWatchlist = watchlist.map(watchItem => {
    const latestData = stocks.find(s => s.symbol === watchItem.symbol);
    return latestData ? latestData : watchItem;
  });

  const handleRemove = (symbol: string) => {
    removeFromWatchlist(symbol);
    toast({
      title: "Stock removed",
      description: `${symbol} has been removed from your watchlist.`,
    });
  };

  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5 fill-yellow-400 stroke-yellow-500" /> My Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {updatedWatchlist.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Star className="h-12 w-12 text-slate-300 mb-2" />
            <p className="text-lg font-medium text-slate-700 dark:text-slate-300">Your watchlist is empty</p>
            <p className="text-sm text-muted-foreground">Search for stocks and add them to your watchlist</p>
          </div>
        ) : (
          <div className="space-y-4">
            {updatedWatchlist.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-3 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800 transition-colors"
              >
                <div 
                  className="cursor-pointer flex-grow"
                  onClick={() => searchStock(stock.symbol)}
                >
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-slate-500">{stock.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={`font-medium ${parseFloat(stock.change) < 0 ? 'text-red-500' : 'text-green-500'}`}>
                    <div>${stock.price}</div>
                    <div className="text-xs">
                      {stock.change} ({stock.changePercent})
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemove(stock.symbol)}
                    className="text-muted-foreground hover:text-red-500 transition-colors"
                    aria-label="Remove from watchlist"
                  >
                    <Star className="h-5 w-5 fill-current" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WatchlistCard;
