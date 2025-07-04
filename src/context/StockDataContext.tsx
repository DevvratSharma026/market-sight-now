
import React, { createContext, useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Stock, ChartDataPoint, PredictedData } from '@/types/stock';
import { useWatchlist } from '@/hooks/useWatchlist';
import { generateChartData, generatePredictionData } from '@/utils/stockDataUtils';

export interface StockDataContextProps {
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

export const StockDataContext = createContext<StockDataContextProps | undefined>(undefined);

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

  // Use the watchlist custom hook
  const { watchlist, addToWatchlist, removeFromWatchlist, isInWatchlist } = useWatchlist();

  // Load stock data from Supabase
  useEffect(() => {
    const fetchStocks = async () => {
      try {
        console.log('Fetching stocks from Supabase...');
        const { data, error } = await supabase
          .from('stock_data')
          .select('*');
        
        if (error) {
          console.error('Error fetching stocks:', error);
          throw error;
        }
        
        console.log('Raw data from Supabase:', data);
        
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
          
          console.log('Formatted stock data:', formattedData);
          setStocks(formattedData);
          
          // Set current stock to first stock if not set
          if (!currentStock.id) {
            const defaultStock = formattedData.find(s => s.symbol === currentStock.symbol);
            if (defaultStock) {
              setCurrentStock(defaultStock);
              setChartData(generateChartData(defaultStock.price));
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
          
          const payloadNew = payload.new as any;
          
          // Update the stocks array with the new data
          setStocks(prevStocks => {
            const updatedStocks = [...prevStocks];
            const index = updatedStocks.findIndex(s => s.id === payloadNew.id);
            
            // Format the new stock data to match our interface
            const formattedStock: Stock = {
              id: payloadNew.id,
              symbol: payloadNew.symbol,
              name: payloadNew.name,
              price: payloadNew.price.toString(),
              change: payloadNew.change.toString(),
              changePercent: payloadNew.change_percent,
              last_updated: payloadNew.last_updated
            };
            
            if (index >= 0) {
              updatedStocks[index] = formattedStock;
              
              // Update current stock if it's the one that changed
              if (currentStock.id === payloadNew.id) {
                setCurrentStock(formattedStock);
                setChartData(generateChartData(formattedStock.price));
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
  }, []); // Remove dependency on currentStock.symbol to allow stocks to load independently

  const searchStock = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    
    // Look for the stock in our stocks array
    const foundStock = stocks.find(stock => stock.symbol === upperSymbol);
    
    if (foundStock) {
      setCurrentStock(foundStock);
      setChartData(generateChartData(foundStock.price));
      setPredictedData(generatePredictionData(upperSymbol, foundStock.price));
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
      setChartData(generateChartData(newStock.price));
      setPredictedData(generatePredictionData(upperSymbol, newStock.price));
    }
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
