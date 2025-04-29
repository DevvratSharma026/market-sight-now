
import { ChartDataPoint, PredictedData } from "@/types/stock";

/**
 * Generates mock chart data for a given base price
 */
export const generateChartData = (basePrice: string): ChartDataPoint[] => {
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
  
  return mockData;
};

/**
 * Generates prediction data for a given stock symbol and current price
 */
export const generatePredictionData = (symbol: string, currentPrice: string): PredictedData => {
  const bullish = Math.round(35 + Math.random() * 40);
  const bearish = 100 - bullish;
  
  const priceValue = parseFloat(currentPrice);
  const predictedChange = (Math.random() * 10) - 3;
  const predictedPrice = (priceValue + predictedChange).toFixed(2);
  
  return {
    bullishProbability: bullish,
    bearishProbability: bearish,
    predictedPrice,
  };
};
