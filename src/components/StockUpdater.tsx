
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StockUpdater = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    // Function to update stock prices
    const updateStocks = async () => {
      try {
        const response = await supabase.functions.invoke('update-stock-prices');
        
        if (response.error) {
          throw new Error(response.error.message);
        }
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error updating stocks:', error);
      }
    };
    
    // Initial update
    updateStocks();
    
    // Update every 10 seconds
    const interval = setInterval(() => {
      updateStocks();
    }, 10000);
    
    // Clean up
    return () => clearInterval(interval);
  }, []);

  return null; // This component doesn't render anything
};

export default StockUpdater;
