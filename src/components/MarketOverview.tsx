
import { Card, CardContent } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign } from 'lucide-react';

const MarketOverview = () => {
  const marketData = [
    { name: 'S&P 500', value: '5,246.14', change: '+0.38%', isPositive: true },
    { name: 'Nasdaq', value: '16,421.38', change: '+0.52%', isPositive: true },
    { name: 'Dow Jones', value: '39,153.32', change: '-0.21%', isPositive: false },
    { name: 'Russell 2000', value: '2,023.54', change: '+0.75%', isPositive: true },
    { name: 'VIX', value: '13.63', change: '-2.15%', isPositive: false },
    { name: '10-Year Treasury', value: '4.29%', change: '+0.02', isPositive: true }
  ];
  
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Market Indices</h3>
          <div className="space-y-4">
            {marketData.map((item) => (
              <div key={item.name} className="flex justify-between items-center border-b pb-2 last:border-0 last:pb-0">
                <div className="flex items-center">
                  {item.isPositive ? 
                    <TrendingUp className="h-4 w-4 mr-2 text-green-500" /> : 
                    <TrendingDown className="h-4 w-4 mr-2 text-red-500" />
                  }
                  <span>{item.name}</span>
                </div>
                <div className="text-right">
                  <div className="font-medium">{item.value}</div>
                  <div className={item.isPositive ? "text-green-500 text-xs" : "text-red-500 text-xs"}>
                    {item.change}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardContent className="pt-6">
          <h3 className="text-lg font-medium mb-4">Market Snapshot</h3>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-slate-50 p-3 rounded-lg dark:bg-slate-800">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Advancing</div>
                <div className="text-green-500">58%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '58%' }}></div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg dark:bg-slate-800">
              <div className="flex justify-between items-center mb-1">
                <div className="text-sm">Declining</div>
                <div className="text-red-500">42%</div>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-2 dark:bg-slate-700">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '42%' }}></div>
              </div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg dark:bg-slate-800 flex items-center justify-between">
              <div className="text-sm">Market Cap</div>
              <div className="font-medium">$42.8T</div>
            </div>
            <div className="bg-slate-50 p-3 rounded-lg dark:bg-slate-800 flex items-center justify-between">
              <div className="text-sm">Volume</div>
              <div className="font-medium">5.2B</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketOverview;
