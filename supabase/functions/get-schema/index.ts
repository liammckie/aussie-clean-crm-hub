
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configure CORS headers for browser access
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
    // Create a Supabase client using service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey, {
      auth: { persistSession: false },
    });
    
    console.log('Fetching schema information...');

    // Query to get all tables in the public schema
    const { data: tables, error: tablesError } = await supabase
      .rpc('get_all_tables');

    if (tablesError) {
      console.error('Error fetching tables:', tablesError);
      throw tablesError;
    }

    // For each table, get its columns
    const schema = [];
    
    for (const table of tables) {
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: table.table_name });
      
      if (columnsError) {
        console.error(`Error fetching columns for table ${table.table_name}:`, columnsError);
        continue;
      }
      
      schema.push({
        table_name: table.table_name,
        columns: columns
      });
    }
    
    console.log(`Successfully fetched schema for ${schema.length} tables`);
    
    return new Response(
      JSON.stringify({ schema }),
      { 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
    
  } catch (error) {
    console.error('Error in get-schema function:', error);
    
    return new Response(
      JSON.stringify({ error: error.message }),
      { 
        status: 500, 
        headers: { 
          ...corsHeaders,
          'Content-Type': 'application/json' 
        } 
      }
    );
  }
});
