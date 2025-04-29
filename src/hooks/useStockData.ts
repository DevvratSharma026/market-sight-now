
import { useContext } from 'react';
import { StockDataContext, StockDataContextProps } from '@/context/StockDataContext';

export const useStockData = () => {
  const context = useContext(StockDataContext);
  if (!context) {
    throw new Error('useStockData must be used within a StockDataProvider');
  }
  return context;
};
