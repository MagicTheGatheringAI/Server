import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import {LogSnag} from "logsnag"

const logsnag = new LogSnag({ 
  token: Deno.env.get('logsnagtoken') ?? '',
  project: Deno.env.get('logsnagproject') ?? ''
});

serve(async (req) => {
  const data = await req.json()
  console.log(data);
  if (data.record.invited == "true") {
    const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${Deno.env.get("RESEND_API_KEY")}`
        },
        body: JSON.stringify({
            from: 'Acme <onboarding@resend.dev>',
            to: [data.record.email],
            subject: 'hello world',
            html: '<strong>it works!</strong>',
        })
    });

    if (res.ok) {
        const data = await res.json();

        return new Response(data, {
            status: 200,
            headers: {
                'Content-Type': 'application/json',
            },
        });
    }
    await logsnag.publish({
      channel: "waitlist",
      event: "User Invited",
      icon: "✉️",
      tags: {
        refID: data.record.referral_code,
      },
      notify: false
    })
  }
  return new Response(
    JSON.stringify(200),
  )
})

// To invoke:
// curl -i --location --request POST 'http://localhost:54321/functions/v1/' \
//   --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0' \
//   --header 'Content-Type: application/json' \
//   --data '{"name":"Functions"}'
