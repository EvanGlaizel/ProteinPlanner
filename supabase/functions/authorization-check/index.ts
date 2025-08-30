// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"
import { createClient } from "npm:@supabase/supabase-js"

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

type queryResult = 
{
    email: string;
}

Deno.serve(async (req) => {

  const corsHeaders = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization"
  };

  //Handle preflight request
  if (req.method === "OPTIONS")
  {
      return new Response(
        null,
        {
            status: 204,
            headers: corsHeaders
        }
      )
  }

  try 
  {
    const { username } = await req.json()

    const { data , error } = await supabase
      .from("username_and_email")
      .select("email")
      .eq("username", username)
      .limit(1)
      .maybeSingle();

    if (error)
    {
        return new Response(
          JSON.stringify({error: error.message}),
          { status: 500, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:5173", } },
        );
    }

    if (!data)
    {
        return new Response(
          JSON.stringify({error: "User not found"}),
          { status: 404, headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:5173", }}
        )
    }

    console.log(data);

    const finalData: queryResult = {
      email: data.email,
    }

    return new Response(
      JSON.stringify(finalData),
      { headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:5173", } },
    )  
  } catch (err) 
  {
    return new Response(JSON.stringify({ error: `Invalid JSON body (${err.message})` }), {
    status: 400,
    headers: { "Content-Type": "application/json", "Access-Control-Allow-Origin": "http://localhost:5173" },
    });
  }
  
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/authorization-check' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
