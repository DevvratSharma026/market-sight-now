import React, { createContext, useContext, useState, useEffect } from 'react';

interface Stock {
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
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

  const mockStocks: Record<string, Stock> = {
    'AAPL': {
      symbol: 'AAPL',
      name: 'Apple Inc.',
      price: '178.72',
      change: '+1.24',
      changePercent: '+0.70%',
    },
    'MSFT': {
      symbol: 'MSFT',
      name: 'Microsoft Corporation',
      price: '425.22',
      change: '+6.45',
      changePercent: '+1.56%',
    },
    'GOOGL': {
      symbol: 'GOOGL',
      name: 'Alphabet Inc.',
      price: '164.36',
      change: '-2.15',
      changePercent: '-1.29%',
    },
    'AMZN': {
      symbol: 'AMZN',
      name: 'Amazon.com Inc.',
      price: '182.41',
      change: '-2.83',
      changePercent: '-1.53%',
    },
    'NVDA': {
      symbol: 'NVDA',
      name: 'NVIDIA Corporation',
      price: '925.17',
      change: '+30.65',
      changePercent: '+3.42%',
    },
    'META': {
      symbol: 'META',
      name: 'Meta Platforms Inc.',
      price: '472.24',
      change: '-2.35',
      changePercent: '-1.89%',
    },
    'TSLA': {
      symbol: 'TSLA',
      name: 'Tesla Inc.',
      price: '172.63',
      change: '+2.45',
      changePercent: '+1.44%',
    },
    'AMD': {
      symbol: 'AMD',
      name: 'Advanced Micro Devices',
      price: '164.82',
      change: '+2.78',
      changePercent: '+1.71%',
    },
  };

  const searchStock = (symbol: string) => {
    const upperSymbol = symbol.toUpperCase();
    
    if (mockStocks[upperSymbol]) {
      setCurrentStock(mockStocks[upperSymbol]);
      generateChartData();
      generatePredictionData(upperSymbol);
    } else {
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
      generateChartData();
      generatePredictionData(upperSymbol);
    }
  };

  const generateChartData = () => {
    const mockData: ChartDataPoint[] = [];
    const today = new Date();
    let basePrice = 170 + Math.random() * 10;
    
    for (let i = 0; i < 24; i++) {
      const time = new Date(today);
      time.setHours(9 + Math.floor(i / 2), (i % 2) * 30);
      
      basePrice += (Math.random() - 0.48) * 2;
      
      mockData.push({
        time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
        price: Number(basePrice.toFixed(2)),
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

  useEffect(() => {
    generateChartData();
  }, []);

  return (
    <StockDataContext.Provider value={{ 
      currentStock, 
      setCurrentStock, 
      searchStock, 
      chartData, 
      predictedData 
    }}>
      {children}
    </StockDataContext.Provider>
  );
};
