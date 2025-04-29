
import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface Stock {
  id?: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  last_updated?: string;
}

interface PredictedData {
  bullishProbability: number;
  bearishProbability: number;
  predictedPrice: string;
}

interface ChartDataPoint {
  time: string;
  price: number;
}

interface StockDataContextProps {
  currentStock: Stock;
  setCurrentStock: React.Dispatch<React.SetStateAction<Stock>>;
  searchStock: (symbol: string) => void;
  chartData: ChartDataPoint[];
  predictedData: PredictedData | null;
  watchlist: Stock[];
  addToWatchlist: (stock: Stock) => void;
  removeFromWatchlist: (symbol: string) => void;
  isInWatchlist: (symbol: string) => boolean;
  stocks: Stock[];
}

const StockDataContext = createContext<StockDataContextProps | undefined>(undefined);

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};

export const StockDataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [stocks, setStocks] = useState<Stock[]>([]);
  const [currentStock, setCurrentStock] = useState<Stock>({
    symbol: 'AAPL',
    name: 'Apple Inc.',
    price: '178.72',
    change: '+1.24',
    changePercent: '+0.70%',
  });
  
  const [chartData, setChartData] = useState<ChartDataPoint[]>([]);
  const [predictedData, setPredictedData] = useState<PredictedData | null>({
    bullishProbability: 65,
    bearishProbability: 35,
    predictedPrice: '184.36',
  });

  // Initialize watchlist from localStorage or empty array
  const [watchlist, setWatchlist] = useState<Stock[]>(() => {
    const savedWatchlist = localStorage.getItem('stockWatchlist');
    return savedWatchlist ? JSON.parse(savedWatchlist) : [];
  });

  // Load stock data from Supabase
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        const { data, error } = await supabase
          .from('stock_data')
          .select('*');
        
        if (error) {
          throw error;
        }
        
        if (data) {
          // Transform data to match our Stock interface
          const formattedData: Stock[] = data.map(stock => ({
            id: stock.id,
            symbol: stock.symbol,
            name: stock.name,
            price: stock.price.toString(),
            change: stock.change.toString(),
            changePercent: stock.change_percent,
            last_updated: stock.last_updated
          }));
          
          setStocks(formattedData);
          
          // Set current stock to first stock if not set
          if (!currentStock.id) {
            const defaultStock = formattedData.find(s => s.symbol === currentStock.symbol);
            if (defaultStock) {
              setCurrentStock(defaultStock);
              generateChartData(defaultStock.price);
            }
          }
        }
      } catch (error) {
        console.error('Error fetching stocks:', error);
      }
    };
    
    fetchStocks();
    
    // Subscribe to real-time updates
    const channel = supabase
      .channel('schema-db-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'stock_data'
        },
        (payload) => {
          console.log('Real-time update:', payload);
          
          if (!payload.new || typeof payload.new !== 'object') {
            console.error('Invalid payload received:', payload);
            return;
          }
          
          // Update the stocks array with the new data
          setStocks(prevStocks => {
            const updatedStocks = [...prevStocks];
            const index = updatedStocks.findIndex(s => s.id === payload.new.id);
            
            // Format the new stock data to match our interface
            const formattedStock: Stock = {
              id: payload.new.id,
              symbol: payload.new.symbol,
              name: payload.new.name,
              price: payload.new.price.toString(),
              change: payload.new.change.toString(),
              changePercent: payload.new.change_percent,
              last_updated: payload.new.last_updated
            };
            
            if (index >= 0) {
              updatedStocks[index] = formattedStock;
              
              // Update current stock if it's the one that changed
              if (currentStock.id === payload.new.id) {
                setCurrentStock(formattedStock);
                generateChartData(formattedStock.price);
              }
            } else {
              updatedStocks.push(formattedStock);
            }
            
            return updatedStocks;
          });
        }
      )
      .subscribe();
    
    // Clean up subscription
    return () => {
      supabase.removeChannel(channel);
    };
  }, [currentStock.symbol]);

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

  const searchStock = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    
    // Look for the stock in our stocks array
    const foundStock = stocks.find(stock => stock.symbol === upperSymbol);
    
    if (foundStock) {
      setCurrentStock(foundStock);
      generateChartData(foundStock.price);
      generatePredictionData(upperSymbol);
    } else {
      // Fallback to mock data if not found in DB
      const randomChange = (Math.random() * 10 - 5).toFixed(2);
      const randomPrice = (100 + Math.random() * 200).toFixed(2);
      const changePercent = ((parseFloat(randomChange) / parseFloat(randomPrice)) * 100).toFixed(2);
      
      const newStock: Stock = {
        symbol: upperSymbol,
        name: `${upperSymbol} Stock`,
        price: randomPrice,
        change: randomChange,
        changePercent: `${changePercent}%`,
      };
      
      setCurrentStock(newStock);
      generateChartData(newStock.price);
      generatePredictionData(upperSymbol);
    }
  };

  const generateChartData = (basePrice: string) => {
    const mockData: ChartDataPoint[] = [];
    const today = new Date();
    let price = parseFloat(basePrice);
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(today);
      time.setHours(9 + Math.floor(i / 2), (i % 2) * 30);
      
      price += (Math.random() - 0.48) * 2;
      
      mockData.push({
        time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
        price: Number(price.toFixed(2)),
      });
    }
    
    setChartData(mockData);
  };

  const generatePredictionData = (symbol: string) => {
    const bullish = Math.round(35 + Math.random() * 40);
    const bearish = 100 - bullish;
    
    const currentPrice = parseFloat(currentStock.price);
    const predictedChange = (Math.random() * 10) - 3;
    const predictedPrice = (currentPrice + predictedChange).toFixed(2);
    
    setPredictedData({
      bullishProbability: bullish,
      bearishProbability: bearish,
      predictedPrice,
    });
  };

  return (
    <StockDataContext.Provider value={{ 
      currentStock, 
      setCurrentStock, 
      searchStock, 
      chartData, 
      predictedData,
      watchlist,
      addToWatchlist,
      removeFromWatchlist,
      isInWatchlist,
      stocks
    }}>
      {children}
    </StockDataContext.Provider>
  );
};
