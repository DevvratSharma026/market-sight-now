
import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search, Loader2 } from 'lucide-react';
import { useStockData } from '@/hooks/useStockData';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const GlobalStockSearch = () => {
  const [symbol, setSymbol] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { searchStock } = useStockData();
  const { toast } = useToast();

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!symbol) return;
    
    // First try to search existing stocks
    searchStock(symbol);
    
    // Then try to fetch new data if not in our database
    setIsLoading(true);
    toast({
      title: "Searching for stock",
      description: `Looking up ${symbol.toUpperCase()} from external API...`,
    });

    try {
      console.log(`Fetching stock data for: ${symbol.toUpperCase()}`);
      const response = await supabase.functions.invoke('update-stock-prices', {
        body: { symbol: symbol.toUpperCase() }
      });
      
      if (response.error) {
        throw new Error(response.error.message);
      }
      
      console.log('Stock API response:', response);
      
      if (response.data.success) {
        // Search again to load the newly added stock
        searchStock(symbol);
        toast({
          title: "Stock data updated",
          description: `Latest data for ${symbol.toUpperCase()} has been fetched.`,
        });
      }
    } catch (error) {
      console.error('Error fetching stock data:', error);
      toast({
        title: "Error fetching stock data",
        description: "Please check the symbol and try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSearch} className="flex items-center space-x-2">
      <div className="relative flex-grow">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search any global stock (e.g. AAPL, 9988.HK, BP.L)"
          className="pl-8 pr-10"
          value={symbol}
          onChange={(e) => setSymbol(e.target.value)}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isLoading && <Loader2 className="h-4 w-4 animate-spin text-muted-foreground" />}
        </div>
      </div>
      <Button type="submit" disabled={isLoading || !symbol}>
        Search
      </Button>
    </form>
  );
};

export default GlobalStockSearch;
