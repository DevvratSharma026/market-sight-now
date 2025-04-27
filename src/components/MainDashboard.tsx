
import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockChart from './StockChart';
import PredictionCard from './PredictionCard';
import MarketOverview from './MarketOverview';
import TopMovers from './TopMovers';
import { useStockData } from '../context/StockDataContext';

const MainDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { currentStock } = useStockData();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentStock.symbol || 'AAPL'}</CardTitle>
                  <CardDescription>{currentStock.name || 'Apple Inc.'}</CardDescription>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">${currentStock.price || '178.72'}</div>
                  <div className={currentStock.change && parseFloat(currentStock.change) >= 0 
                    ? "text-green-500" 
                    : "text-red-500"}>
                    {currentStock.change || '+1.24'} ({currentStock.changePercent || '+0.70%'})
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue="1D" className="w-full">
                <div className="flex justify-between mb-4">
                  <TabsList>
                    <TabsTrigger value="1D">1D</TabsTrigger>
                    <TabsTrigger value="1W">1W</TabsTrigger>
                    <TabsTrigger value="1M">1M</TabsTrigger>
                    <TabsTrigger value="3M">3M</TabsTrigger>
                    <TabsTrigger value="1Y">1Y</TabsTrigger>
                    <TabsTrigger value="ALL">ALL</TabsTrigger>
                  </TabsList>
                </div>
                <TabsContent value="1D" className="h-[400px]">
                  <StockChart timeframe="1D" />
                </TabsContent>
                <TabsContent value="1W" className="h-[400px]">
                  <StockChart timeframe="1W" />
                </TabsContent>
                <TabsContent value="1M" className="h-[400px]">
                  <StockChart timeframe="1M" />
                </TabsContent>
                <TabsContent value="3M" className="h-[400px]">
                  <StockChart timeframe="3M" />
                </TabsContent>
                <TabsContent value="1Y" className="h-[400px]">
                  <StockChart timeframe="1Y" />
                </TabsContent>
                <TabsContent value="ALL" className="h-[400px]">
                  <StockChart timeframe="ALL" />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <PredictionCard />
            <Card>
              <CardHeader>
                <CardTitle>Most Viewed Stocks</CardTitle>
                <CardDescription>Popular stocks among users</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { symbol: 'TSLA', name: 'Tesla Inc', views: '25.4K' },
                    { symbol: 'AAPL', name: 'Apple Inc', views: '22.1K' },
                    { symbol: 'NVDA', name: 'NVIDIA Corp', views: '18.7K' },
                    { symbol: 'AMD', name: 'Advanced Micro Devices', views: '15.2K' },
                    { symbol: 'MSFT', name: 'Microsoft Corp', views: '14.8K' }
                  ].map((stock) => (
                    <div
                      key={stock.symbol}
                      className="flex justify-between items-center p-2 hover:bg-slate-100 rounded-md cursor-pointer dark:hover:bg-slate-800"
                      onClick={() => searchStock(stock.symbol)}
                    >
                      <div>
                        <div className="font-medium">{stock.symbol}</div>
                        <div className="text-xs text-slate-500">{stock.name}</div>
                      </div>
                      <div className="text-sm text-slate-500">{stock.views} views</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
        
        <div className="md:col-span-4">
          <TopMovers />
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
