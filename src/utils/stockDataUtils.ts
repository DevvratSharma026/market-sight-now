
import { ChartDataPoint, PredictedData } from "@/types/stock";

/**
 * Generates mock chart data for a given base price and timeframe
 */
export const generateChartData = (basePrice: string, timeframe: string = '1D'): ChartDataPoint[] => {
  const mockData: ChartDataPoint[] = [];
  const now = new Date();
  let price = parseFloat(basePrice);
  
  switch(timeframe) {
    case '1D': // 1 Day - 24 data points for each hour
      for (let i = 0; i < 24; i++) {
        const time = new Date(now);
        time.setHours(9 + Math.floor(i / 2), (i % 2) * 30);
        
        // Smaller price variations for a single day
        price += (Math.random() - 0.48) * 2;
        
        mockData.push({
          time: `${time.getHours()}:${time.getMinutes().toString().padStart(2, '0')}`,
          price: Number(price.toFixed(2)),
        });
      }
      break;
      
    case '1W': // 1 Week - data points for each day of the week
      for (let i = 6; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        
        // Larger price variations for a week
        price = parseFloat(basePrice) + (Math.random() - 0.45) * (parseFloat(basePrice) * 0.05);
        
        mockData.push({
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(price.toFixed(2)),
        });
      }
      break;
      
    case '1M': // 1 Month - data points for each week
      for (let i = 0; i < 4; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 7));
        
        // Even larger price variations for a month
        price = parseFloat(basePrice) + (Math.random() - 0.5) * (parseFloat(basePrice) * 0.08);
        
        mockData.push({
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(price.toFixed(2)),
        });
      }
      mockData.reverse(); // Make sure dates are in chronological order
      break;
      
    case '3M': // 3 Months - data points for each two weeks
      for (let i = 0; i < 6; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() - (i * 14));
        
        price = parseFloat(basePrice) + (Math.random() - 0.5) * (parseFloat(basePrice) * 0.1);
        
        mockData.push({
          time: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
          price: Number(price.toFixed(2)),
        });
      }
      mockData.reverse();
      break;
      
    case '1Y': // 1 Year - data points for each month
      for (let i = 11; i >= 0; i--) {
        const date = new Date(now);
        date.setMonth(date.getMonth() - i);
        
        price = parseFloat(basePrice) + (Math.random() - 0.5) * (parseFloat(basePrice) * 0.15);
        
        mockData.push({
          time: date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' }),
          price: Number(price.toFixed(2)),
        });
      }
      break;
      
    case 'ALL': // All time - going back several years
      for (let i = 4; i >= 0; i--) {
        const date = new Date(now);
        date.setFullYear(date.getFullYear() - i);
        
        // Dramatic price variations over years
        price = parseFloat(basePrice) * (0.6 + (Math.random() * 0.8));
        
        mockData.push({
          time: date.toLocaleDateString('en-US', { year: 'numeric' }),
          price: Number(price.toFixed(2)),
        });
      }
      break;
      
    default:
      // Default to 1D if timeframe is not recognized
      return generateChartData(basePrice, '1D');
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
