
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.32.0';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const supabaseUrl = "https://ocwoqhnxaunhrezvsevn.supabase.co";
    const supabaseKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    const { data: requestData } = await req.json().catch(() => ({ data: {} }));
    const symbol = requestData?.symbol;
    
    // If a specific symbol is requested, fetch just that one
    if (symbol) {
      try {
        const stockData = await fetchStockData(symbol);
        if (stockData) {
          await updateStockInDatabase(supabase, stockData);
          return new Response(JSON.stringify({ success: true, data: stockData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        }
      } catch (error) {
        console.error(`Error fetching data for ${symbol}:`, error);
        return new Response(JSON.stringify({ error: `Failed to fetch data for ${symbol}` }), {
          status: 400,
          headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        });
      }
    } 
    
    // Otherwise, update all stocks in the database
    const { data: stocks, error: fetchError } = await supabase
      .from('stock_data')
      .select('*');
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Update each stock with a real data fetch attempt first, fall back to random changes
    for (const stock of stocks) {
      try {
        const stockData = await fetchStockData(stock.symbol);
        if (stockData) {
          await updateStockInDatabase(supabase, stockData);
          continue; // Skip to next stock if successful
        }
      } catch (error) {
        console.error(`Error fetching real data for ${stock.symbol}:`, error);
        // Fall back to random changes
      }
      
      // Fallback to random changes if API fetch fails
      const randomChange = (Math.random() * 2 - 1).toFixed(2);
      const newPrice = (parseFloat(stock.price) + parseFloat(randomChange)).toFixed(2);
      const changePercent = ((parseFloat(randomChange) / parseFloat(stock.price)) * 100).toFixed(2);
      const formattedChangePercent = changePercent >= 0 ? `+${changePercent}%` : `${changePercent}%`;
      
      const { error: updateError } = await supabase
        .from('stock_data')
        .update({
          price: newPrice,
          change: randomChange,
          change_percent: formattedChangePercent,
          last_updated: new Date().toISOString()
        })
        .eq('id', stock.id);
      
      if (updateError) {
        console.error(`Error updating ${stock.symbol}:`, updateError);
      }
    }
    
    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 200,
    });
  } catch (error) {
    console.error('Error updating stock prices:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function fetchStockData(symbol: string) {
  try {
    // Use Alpha Vantage API with your API key
    const API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    
    if (!API_KEY) {
      console.warn("Missing Alpha Vantage API key, cannot fetch real data");
      return null;
    }
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${API_KEY}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    
    // Check if we got a valid response with price data
    if (data['Global Quote'] && data['Global Quote']['05. price']) {
      const quote = data['Global Quote'];
      const currentPrice = parseFloat(quote['05. price']).toFixed(2);
      const previousClose = parseFloat(quote['08. previous close']).toFixed(2);
      const change = (parseFloat(currentPrice) - parseFloat(previousClose)).toFixed(2);
      const changePercent = quote['10. change percent'].trim();
      
      return {
        symbol,
        price: currentPrice,
        change,
        change_percent: changePercent,
        market: getMarketForSymbol(symbol),
        currency: getCurrencyForSymbol(symbol),
        last_updated: new Date().toISOString()
      };
    }
    
    console.warn(`No valid price data found for ${symbol}`);
    return null;
  } catch (error) {
    console.error(`Error fetching stock data for ${symbol}:`, error);
    return null;
  }
}

async function updateStockInDatabase(supabase, stockData) {
  try {
    // Check if the stock already exists
    const { data: existingStock, error: checkError } = await supabase
      .from('stock_data')
      .select('id')
      .eq('symbol', stockData.symbol)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      throw checkError;
    }
    
    if (existingStock) {
      // Update existing stock
      const { error: updateError } = await supabase
        .from('stock_data')
        .update({
          price: stockData.price,
          change: stockData.change,
          change_percent: stockData.change_percent,
          market: stockData.market,
          currency: stockData.currency,
          last_updated: new Date().toISOString()
        })
        .eq('id', existingStock.id);
      
      if (updateError) {
        throw updateError;
      }
    } else {
      // Insert new stock with a name (derive from symbol if needed)
      const name = stockData.name || `${stockData.symbol} Stock`;
      const { error: insertError } = await supabase
        .from('stock_data')
        .insert({
          symbol: stockData.symbol,
          name: name,
          price: stockData.price,
          change: stockData.change,
          change_percent: stockData.change_percent,
          market: stockData.market,
          currency: stockData.currency,
          last_updated: new Date().toISOString()
        });
      
      if (insertError) {
        throw insertError;
      }
    }
    
    return true;
  } catch (error) {
    console.error(`Error updating stock in database: ${stockData.symbol}`, error);
    return false;
  }
}

function getMarketForSymbol(symbol) {
  // Simple logic to determine market based on symbol
  // Could be improved with a more comprehensive lookup
  if (symbol.endsWith('.HK')) return 'Hong Kong';
  if (symbol.endsWith('.L')) return 'London';
  if (symbol.endsWith('.PA')) return 'Paris';
  if (symbol.endsWith('.DE')) return 'Germany';
  if (symbol.endsWith('.TO')) return 'Toronto';
  if (symbol.endsWith('.TW')) return 'Taiwan';
  if (symbol.endsWith('.AX')) return 'Australia';
  return 'US'; // Default to US market
}

function getCurrencyForSymbol(symbol) {
  // Simple logic to determine currency based on symbol/market
  const market = getMarketForSymbol(symbol);
  
  switch (market) {
    case 'Hong Kong': return 'HKD';
    case 'London': return 'GBP';
    case 'Paris': return 'EUR';
    case 'Germany': return 'EUR';
    case 'Toronto': return 'CAD';
    case 'Taiwan': return 'TWD';
    case 'Australia': return 'AUD';
    default: return 'USD';
  }
}
