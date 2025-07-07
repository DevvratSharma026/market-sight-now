import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown, TrendingUp, TrendingDown } from 'lucide-react';
import { useStockData } from '@/hooks/useStockData';
import { convertCurrency, formatCurrency } from '@/utils/currencyConverter';

const PredictionCard = () => {
  const { currentStock, predictedData } = useStockData();
  const [bullishProbability, setBullishProbability] = useState(65);
  const [bearishProbability, setBearishProbability] = useState(35);
  const [predictedPrice, setPredictedPrice] = useState('184.36');
  const [timeframe, setTimeframe] = useState('24h');
  
  useEffect(() => {
    if (predictedData) {
      setBullishProbability(predictedData.bullishProbability || 65);
      setBearishProbability(predictedData.bearishProbability || 35);
      setPredictedPrice(predictedData.predictedPrice || '184.36');
    }
  }, [predictedData]);

  // Convert USD prices to INR
  const currentPriceUSD = parseFloat(currentStock.price || '178.72');
  const predictedPriceUSD = parseFloat(predictedPrice);
  const currentPriceINR = convertCurrency(currentPriceUSD, 'USD', 'INR');
  const predictedPriceINR = convertCurrency(predictedPriceUSD, 'USD', 'INR');

  return (
    <Card className="overflow-hidden bg-gradient-to-br from-primary/5 to-secondary/5 border-0 shadow-lg">
      <CardHeader className="bg-gradient-to-r from-primary/10 to-secondary/10 pb-4">
        <CardTitle className="flex items-center text-xl">
          <TrendingUp className="w-6 h-6 mr-2 text-primary" />
          AI Prediction
          <span className="bg-gradient-to-r from-primary to-secondary text-primary-foreground text-xs font-medium ml-2 px-3 py-1 rounded-full">
            Beta
          </span>
        </CardTitle>
        <CardDescription className="text-base">
          Market prediction for {currentStock.symbol || 'AAPL'} in the next {timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent className="p-6">
        <div className="space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-6 rounded-xl border border-green-200/50 dark:border-green-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-green-400/10 to-emerald-500/10 rounded-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 mr-2 text-green-600" />
                  <span className="text-sm font-semibold text-green-800 dark:text-green-200">Predicted Price</span>
                </div>
                <div className="text-3xl font-bold text-green-900 dark:text-green-100 mb-2">
                  {formatCurrency(predictedPriceINR, 'INR')}
                </div>
                <div className="text-xs text-green-600 dark:text-green-400">In the next {timeframe}</div>
              </div>
            </div>
            
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-6 rounded-xl border border-blue-200/50 dark:border-blue-800/50 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-400/10 to-indigo-500/10 rounded-xl"></div>
              <div className="relative z-10">
                <div className="flex items-center mb-3">
                  <TrendingDown className="w-5 h-5 mr-2 text-blue-600" />
                  <span className="text-sm font-semibold text-blue-800 dark:text-blue-200">Current Price</span>
                </div>
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100 mb-2">
                  {formatCurrency(currentPriceINR, 'INR')}
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400">Last updated: just now</div>
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-muted/50 to-accent/50 p-6 rounded-xl">
            <h4 className="text-lg font-semibold mb-6 text-center">Market Sentiment</h4>
            
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <ArrowUp className="w-5 h-5 mr-2 text-green-500" />
                    <span className="font-medium text-green-700 dark:text-green-300">Bullish</span>
                  </div>
                  <div className="font-bold text-green-700 dark:text-green-300">{bullishProbability}%</div>
                </div>
                <Progress value={bullishProbability} className="h-3 bg-green-100 dark:bg-green-900/30" />
              </div>
              
              <div>
                <div className="flex justify-between mb-3">
                  <div className="flex items-center">
                    <ArrowDown className="w-5 h-5 mr-2 text-red-500" />
                    <span className="font-medium text-red-700 dark:text-red-300">Bearish</span>
                  </div>
                  <div className="font-bold text-red-700 dark:text-red-300">{bearishProbability}%</div>
                </div>
                <Progress value={bearishProbability} className="h-3 bg-red-100 dark:bg-red-900/30" />
              </div>
            </div>
          </div>
          
          <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-900/20 dark:to-orange-900/20 p-6 rounded-xl border border-amber-200/50 dark:border-amber-800/50">
            <h4 className="font-semibold mb-4 text-amber-800 dark:text-amber-200 flex items-center">
              <span className="w-2 h-2 bg-amber-500 rounded-full mr-3 animate-pulse"></span>
              Key Prediction Factors
            </h4>
            <ul className="space-y-3 text-sm text-amber-700 dark:text-amber-300">
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Technical indicators suggest moderate upward momentum
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Recent earnings exceeded analyst expectations
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Market sentiment analysis shows positive trend
              </li>
              <li className="flex items-start">
                <span className="w-1.5 h-1.5 bg-amber-500 rounded-full mr-3 mt-2 flex-shrink-0"></span>
                Similar historical patterns resulted in price increases
              </li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
