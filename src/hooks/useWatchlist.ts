
import { useState, useEffect } from 'react';
import { Stock } from '@/types/stock';
import { toast } from '@/hooks/use-toast';

export const useWatchlist = () => {
  // Initialize watchlist from localStorage or empty array
  const [watchlist, setWatchlist] = useState<Stock[]>(() => {
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Save watchlist to localStorage when it changes
  useEffect(() => {
    localStorage.setItem('stockWatchlist', JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = (stock: Stock) => {
    setWatchlist(prev => {
      if (!prev.some(s => s.symbol === stock.symbol)) {
        toast({
          title: "Added to Watchlist",
          description: `${stock.symbol} has been added to your watchlist.`,
        });
        return [...prev, stock];
      }
      return prev;
    });
  };

  const removeFromWatchlist = (symbol: string) => {
    setWatchlist(prev => prev.filter(stock => stock.symbol !== symbol));
  };

  const isInWatchlist = (symbol: string) => {
    return watchlist.some(stock => stock.symbol === symbol);
  };

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
};
