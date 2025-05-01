
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const StockUpdater = () => {
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);
  const [apiKeyError, setApiKeyError] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    // Function to update stock prices
    const updateStocks = async () => {
      try {
        console.log("Updating stock prices...");
        const response = await supabase.functions.invoke('update-stock-prices');
        
        if (response.error) {
          console.error('Error from edge function:', response.error);
          // Check if it's an API key error
          if (response.error.message && response.error.message.includes('Alpha Vantage API key')) {
            if (!apiKeyError) {
              setApiKeyError(true);
              toast({
                title: "API Key Error",
                description: "Alpha Vantage API key is missing or invalid. Check Supabase Edge Function configuration.",
                variant: "destructive"
              });
            }
          } else {
            throw new Error(response.error.message);
          }
          return;
        }
        
        // If we had an API key error before but now it's working, clear the error
        if (apiKeyError) {
          setApiKeyError(false);
          toast({
            title: "API Key Valid",
            description: "Alpha Vantage API key is now working correctly.",
            variant: "default"
          });
        }
        
        setLastUpdate(new Date());
      } catch (error) {
        console.error('Error updating stocks:', error);
        toast({
          title: "Stock Update Failed",
          description: error.message || "Could not update stock prices",
          variant: "destructive"
        });
      }
    };
    
    // Initial update
    updateStocks();
    
    // Removed the interval to stop automatic refreshing
    
    // Clean up - no interval to clear anymore
  }, [toast, apiKeyError]);

  return null; // This component doesn't render anything
};

export default StockUpdater;
