
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.38.4";

// Configure CORS headers for browser access
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  console.log('Edge function get-schema called');
  
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create a Supabase client using service role key for admin access
    const supabaseUrl = Deno.env.get('SUPABASE_URL') || '';
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') || '';
    
    if (!supabaseUrl || !supabaseServiceKey) {
      console.error('Missing environment variables: SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY');
      throw new Error('Server configuration error');
    }
    
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

    console.log(`Fetched ${tables?.length || 0} tables`);

    // For each table, get its columns
    const schema = [];
    
    for (const table of tables || []) {
      console.log(`Fetching columns for table: ${table.table_name}`);
      const { data: columns, error: columnsError } = await supabase
        .rpc('get_table_columns', { table_name: table.table_name });
      
      if (columnsError) {
        console.error(`Error fetching columns for table ${table.table_name}:`, columnsError);
        continue;
      }
      
      // Fetch foreign key information (in a future update)
      // This would enhance the schema with relationship data
      
      schema.push({
        table_name: table.table_name,
        columns: columns || []
      });
    }
    
    console.log(`Successfully fetched schema for ${schema.length} tables`);
    
    return new Response(
      JSON.stringify({ 
        schema,
        timestamp: new Date().toISOString(),
        metadata: {
          version: '1.1',
          generated_by: 'get-schema edge function'
        }
      }),
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
      JSON.stringify({ 
        error: error.message || 'Unknown error',
        status: 'error'
      }),
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
