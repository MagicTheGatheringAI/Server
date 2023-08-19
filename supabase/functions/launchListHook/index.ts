import { serve } from 'std/server'
import { createClient } from '@supabase/supabase-js'
import { LogSnag } from 'logsnag'

const supabaseClient = createClient(
  Deno.env.get('SUPABASE_URL') ?? '',
  Deno.env.get('SUPABASE_ANON_KEY') ?? '',
)
const logsnag = new LogSnag({ 
  token: Deno.env.get('logsnagtoken') ?? '',
  project: Deno.env.get('logsnagproject') ?? ''
});

serve(async (req) => {
  const event = await req.json()
  console.log(event[0].referral_code, event[0].email)
  const { error } = await supabaseClient
    .from('waitlist')
    .insert({ referID: event[0].referral_code, email: event[0].email })
    if (error) throw error

  await logsnag.publish({
    channel: "waitlist",
    event: "User Waitlisted",
    icon: "‼",
    tags: {
      refid: event[0].referral_code,
    },
    notify: false
  })

  return new Response(
    JSON.stringify("200"),
    { headers: { "Content-Type": "application/json" } },
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
