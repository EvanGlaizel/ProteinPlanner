// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts"


Deno.serve(async (req) => 
{
  const corsHeaders = {
    "Access-Control-Allow-Origin": "https://proteinplanner.netlify.app",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, Authorization, apikey, x-client-info"
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
    const { prompt } = await req.json();

    const aiKey=Deno.env.get("GEMINI_API_KEY");

    if (!aiKey)
    {
      return new Response(JSON.stringify({error: "Missing Gemini API Key"}), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + aiKey,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          contents: [{ 
              role: "user", 
              parts: [{text: prompt}]
          }],

          generationConfig: {
            responseMimeType: "application/json"
          }
        }),
      });

    if (!response.ok)
    {
      const errorDetails = await response.text();
      console.error("Error response from Gemini API: ", errorDetails);

      return new Response(JSON.stringify({error: "Error from AI API"}), 
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" }
      });
    }

    const data = await response.json();
    const rawText = data?.candidates?.[0]?.content?.parts?.[0]?.text || {};
    let jsonResult = {};
    console.log("Raw AI response text: ", rawText);
    try
    {
      jsonResult = JSON.parse(rawText);
    }
    catch (err)
    {
      console.error("AI Response is not in the correct format. Defaulting to an empty object. AI response is: ", rawText);
    }
    

    return new Response(
      JSON.stringify( { reply: jsonResult } ),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    )

  }
  catch (err)
  {
    console.error("Error in AI function: ", err.message);
    return new Response(JSON.stringify({ error: err.message }), 
    {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
    })
  }
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/ai-calorie-estimation' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
