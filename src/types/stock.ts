
export interface Stock {
  id?: string;
  symbol: string;
  name: string;
  price: string;
  change: string;
  changePercent: string;
  last_updated?: string;
}

export interface PredictedData {
  bullishProbability: number;
  bearishProbability: number;
  predictedPrice: string;
}

export interface ChartDataPoint {
  time: string;
  price: number;
}
