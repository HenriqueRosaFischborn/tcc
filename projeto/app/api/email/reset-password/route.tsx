// export const runtime = 'nodejs'

// import { Resend } from 'resend';
// import * as React from 'react';
// import { EmailTemplate } from '@/email-template/reset-password';

// const resend = new Resend(process.env.RESEND_API_KEY);

// export async function POST(req: Request) {
//   try {
//     const { data, error } = await resend.emails.send({
//       from: 'Acme <onboarding@resend.dev>',
//       to: ['henriquewordpress5@gmail.com'],
//       subject: 'Hello world',
//       html: '<h1>goooooo</h1>'
//     });

//     if (error) {
//       return Response.json({ error }, { status: 500 });
//     }

//     return Response.json({ data });
//   } catch (error) {
//     return Response.json({ error }, { status: 500 });
//   }
// }