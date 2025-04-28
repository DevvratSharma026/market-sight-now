import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import StockChart from './StockChart';
import PredictionCard from './PredictionCard';
import TopMovers from './TopMovers';
import { useStockData } from '../context/StockDataContext';
import { Star } from 'lucide-react';

const MainDashboard = () => {
  const { currentStock, addToWatchlist, removeFromWatchlist, isInWatchlist } = useStockData();

  return (
    <div className="container mx-auto px-4 py-6">
      <div className="grid gap-6 md:grid-cols-12">
        <div className="md:col-span-8 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>{currentStock.symbol}</CardTitle>
                  <CardDescription>{currentStock.name}</CardDescription>
                </div>
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold">${currentStock.price}</div>
                    <div className={currentStock.change.startsWith('-') 
                      ? "text-red-500" 
                      : "text-green-500"}>
                      {currentStock.change} ({currentStock.changePercent})
                    </div>
                  </div>
                  <button
                    onClick={() => isInWatchlist(currentStock.symbol) 
                      ? removeFromWatchlist(currentStock.symbol)
                      : addToWatchlist(currentStock)
                    }
                    className="p-2 hover:bg-slate-100 rounded-full dark:hover:bg-slate-800"
                  >
                    <Star 
                      className={`h-6 w-6 ${isInWatchlist(currentStock.symbol) ? 'fill-current text-primary' : 'text-muted-foreground'}`}
                    />
                  </button>
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
          
          <div className="grid grid-cols-1 gap-6">
            <PredictionCard />
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
