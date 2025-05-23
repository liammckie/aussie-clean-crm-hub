
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.7";

// CORS headers for the function
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

// Create a Supabase client
const supabaseUrl = Deno.env.get("SUPABASE_URL") || "https://fzrhweggxusfwrohtvpb.supabase.co";
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") || "";
const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Parse the request body
    const payload = await req.json();
    const { type, timestamp, appVersion, environment, data } = payload;

    // Add additional metadata
    const metadata = {
      ip: req.headers.get("x-forwarded-for") || "unknown",
      userAgent: req.headers.get("user-agent") || "unknown",
      referer: req.headers.get("referer") || "unknown",
      host: req.headers.get("host") || "unknown",
      origin: req.headers.get("origin") || "unknown",
    };

    // Validate payload
    if (!type || !['exception', 'message', 'feedback'].includes(type)) {
      throw new Error('Invalid log type');
    }

    // Sanitize and clean up data before inserting
    const sanitizedData = typeof data === 'object' && data !== null ? data : { message: String(data) };

    // Insert the log into the database
    const { error } = await supabase
      .from("error_logs")
      .insert([{
        type,
        timestamp: timestamp || new Date().toISOString(),
        app_version: appVersion,
        environment,
        data: sanitizedData,
        metadata
      }]);

    if (error) {
      console.error("Error inserting log:", error);
      throw new Error(`Failed to insert log: ${error.message}`);
    }

    return new Response(JSON.stringify({
      success: true,
      message: "Error log saved successfully"
    }), {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  } catch (error) {
    console.error("Error processing log request:", error);
    
    return new Response(JSON.stringify({
      success: false,
      error: error.message,
      timestamp: new Date().toISOString()
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json"
      }
    });
  }
});
