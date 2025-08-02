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
  const { username } = await req.json()
  const { data , error } = await supabase
    .from("Usernames")
    .select("user:auth.users ( email )")
    .eq("username", username)
    .limit(1)
    .maybeSingle();

  if (error)
  {
      return new Response(
        JSON.stringify({error: error.message}),
        { status: 500, headers: { "Content-Type": "application/json" } },
      );
  }

  if (!data)
  {
      return new Response(
        JSON.stringify({error: "User not found"}),
        { status: 404, headers: { "Content-Type": "application/json" }}
      )
  }

  const finalData: queryResult = {
    email: data.user.email,
  }

  return new Response(
    JSON.stringify(finalData),
    { headers: { "Content-Type": "application/json" } },
  )
})

/* To invoke locally:

  1. Run `supabase start` (see: https://supabase.com/docs/reference/cli/supabase-start)
  2. Make an HTTP request:

  curl -i --location --request POST 'http://127.0.0.1:54321/functions/v1/authorization-check' \
    --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
    --header 'Content-Type: application/json' \
    --data '{"name":"Functions"}'

*/
