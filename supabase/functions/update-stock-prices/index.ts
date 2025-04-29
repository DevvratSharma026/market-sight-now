
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
    
    // Get the current stock data from the database
    const { data: stocks, error: fetchError } = await supabase
      .from('stock_data')
      .select('*');
    
    if (fetchError) {
      throw fetchError;
    }
    
    // Update each stock with a small random price change
    for (const stock of stocks) {
      const randomChange = (Math.random() * 2 - 1).toFixed(2); // Random value between -1 and +1
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
