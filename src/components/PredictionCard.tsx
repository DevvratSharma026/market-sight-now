
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { ArrowUp, ArrowDown } from 'lucide-react';
import { useStockData } from '../context/StockDataContext';

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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          AI Prediction
          <span className="bg-blue-100 text-blue-800 text-xs font-medium ml-2 px-2.5 py-0.5 rounded dark:bg-blue-900 dark:text-blue-300">
            Beta
          </span>
        </CardTitle>
        <CardDescription>
          Market prediction for {currentStock.symbol || 'AAPL'} in the next {timeframe}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-800">
              <div className="text-sm font-medium mb-2">Predicted Price</div>
              <div className="text-2xl font-bold">${predictedPrice}</div>
              <div className="text-xs text-slate-500 mt-1">In the next {timeframe}</div>
            </div>
            <div className="bg-slate-50 p-4 rounded-lg dark:bg-slate-800">
              <div className="text-sm font-medium mb-2">Current Price</div>
              <div className="text-2xl font-bold">${currentStock.price || '178.72'}</div>
              <div className="text-xs text-slate-500 mt-1">Last updated: just now</div>
            </div>
          </div>
          
          <div>
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <ArrowUp className="w-4 h-4 mr-1 text-green-500" />
                <span className="text-sm font-medium">Bullish</span>
              </div>
              <div className="text-sm font-medium">{bullishProbability}%</div>
            </div>
            <Progress value={bullishProbability} className="h-2 mb-3" />
            
            <div className="flex justify-between mb-2">
              <div className="flex items-center">
                <ArrowDown className="w-4 h-4 mr-1 text-red-500" />
                <span className="text-sm font-medium">Bearish</span>
              </div>
              <div className="text-sm font-medium">{bearishProbability}%</div>
            </div>
            <Progress value={bearishProbability} className="h-2" />
          </div>
          
          <div>
            <h4 className="text-sm font-medium mb-2">Prediction Factors</h4>
            <ul className="text-xs space-y-1">
              <li>• Technical indicators suggest moderate upward momentum</li>
              <li>• Recent earnings exceeded analyst expectations</li>
              <li>• Market sentiment analysis shows positive trend</li>
              <li>• Similar historical patterns resulted in price increases</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PredictionCard;
