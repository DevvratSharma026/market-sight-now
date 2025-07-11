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
    
    // Get Alpha Vantage API key from environment variables
    const ALPHA_VANTAGE_API_KEY = Deno.env.get("ALPHA_VANTAGE_API_KEY");
    
    if (!ALPHA_VANTAGE_API_KEY) {
      console.error("Missing Alpha Vantage API key in environment variables");
      return new Response(JSON.stringify({ 
        error: "Missing Alpha Vantage API key configuration", 
        details: "The ALPHA_VANTAGE_API_KEY environment variable is not set."
      }), {
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      });
    }
    
    console.log(`Alpha Vantage API Key found: ${ALPHA_VANTAGE_API_KEY.substring(0, 3)}...`);
    
    const { data: requestData } = await req.json().catch(() => ({ data: {} }));
    const symbol = requestData?.symbol;
    
    console.log(`Request received, looking for symbol: ${symbol || 'all stocks'}`);
    
    // If a specific symbol is requested, fetch just that one
    if (symbol) {
      try {
        console.log(`Attempting to fetch data for specific symbol: ${symbol}`);
        const stockData = await fetchStockData(symbol, ALPHA_VANTAGE_API_KEY);
        if (stockData) {
          console.log(`Successfully fetched data for ${symbol}:`, stockData);
          await updateStockInDatabase(supabase, stockData);
          return new Response(JSON.stringify({ success: true, data: stockData }), {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          });
        } else {
          console.log(`No data returned for ${symbol}`);
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
    
    console.log(`Updating ${stocks.length} stocks`);
    
    // Update each stock with a real data fetch attempt first, fall back to random changes
    for (const stock of stocks) {
      try {
        console.log(`Attempting to fetch real data for ${stock.symbol}`);
        const stockData = await fetchStockData(stock.symbol, ALPHA_VANTAGE_API_KEY);
        if (stockData) {
          console.log(`Successfully fetched real data for ${stock.symbol}`);
          await updateStockInDatabase(supabase, stockData);
          continue; // Skip to next stock if successful
        } else {
          console.log(`No real data returned for ${stock.symbol}, using fallback`);
        }
      } catch (error) {
        console.error(`Error fetching real data for ${stock.symbol}:`, error);
        // Fall back to random changes
      }
      
      // Fallback to random changes if API fetch fails
      console.log(`Using random data for ${stock.symbol}`);
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

async function fetchStockData(symbol: string, apiKey: string) {
  try {
    // Use Alpha Vantage API with the provided API key
    if (!apiKey) {
      console.warn("Missing Alpha Vantage API key, cannot fetch real data");
      return null;
    }
    
    console.log(`Fetching stock data from Alpha Vantage for ${symbol} with API key: ${apiKey.substring(0, 3)}...`);
    
    const response = await fetch(
      `https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${symbol}&apikey=${apiKey}`
    );
    
    if (!response.ok) {
      throw new Error(`API responded with status: ${response.status}`);
    }
    
    const data = await response.json();
    console.log(`Alpha Vantage response for ${symbol}:`, JSON.stringify(data).substring(0, 200) + '...');
    
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
