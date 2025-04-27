
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
          
          <PredictionCard />
        </div>
        
        <div className="md:col-span-4 space-y-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="movers">Top Movers</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6 mt-4">
              <MarketOverview />
            </TabsContent>
            <TabsContent value="movers" className="mt-4">
              <TopMovers />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default MainDashboard;
