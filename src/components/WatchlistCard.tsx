
import { useStockData } from '../context/StockDataContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star } from 'lucide-react';

const WatchlistCard = () => {
  const { watchlist, searchStock, removeFromWatchlist } = useStockData();

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Star className="h-5 w-5" /> Watchlist
        </CardTitle>
      </CardHeader>
      <CardContent>
        {watchlist.length === 0 ? (
          <p className="text-sm text-muted-foreground">No stocks in watchlist</p>
        ) : (
          <div className="space-y-4">
            {watchlist.map((stock) => (
              <div
                key={stock.symbol}
                className="flex items-center justify-between p-2 hover:bg-slate-100 rounded-md dark:hover:bg-slate-800"
              >
                <div 
                  className="cursor-pointer flex-grow"
                  onClick={() => searchStock(stock.symbol)}
                >
                  <div className="font-medium">{stock.symbol}</div>
                  <div className="text-xs text-slate-500">{stock.name}</div>
                </div>
                <div className="flex items-center gap-4">
                  <div className={stock.change.startsWith('-') ? 'text-red-500' : 'text-green-500'}>
                    {stock.change} ({stock.changePercent})
                  </div>
                  <button
                    onClick={() => removeFromWatchlist(stock.symbol)}
                    className="text-muted-foreground hover:text-primary"
                  >
                    <Star className="h-4 w-4 fill-current" />
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
