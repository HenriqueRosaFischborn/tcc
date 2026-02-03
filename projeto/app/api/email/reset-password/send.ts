export const runtime = 'nodejs'


import { EmailTemplate } from '@/email-template/reset-password';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendEmail(email: string, token: string) {
  console.log(email)
  try {
    const { data, error } = await resend.emails.send({
      from: `Henrique <resetpassword@testetcc.com.br>`,
      to: [email],
      subject: 'Redefinir senha',
      html: `
          
        <p>
          Olá, <br/>
          <br/>
          Recebemos sua solicitação para redefinição de senha<br/>
          <br/>
          Link para redefinir senha: <br/>
          Para redefinir sua senha: <a href="http://localhost:3000/redefinir-senha?token=${token}&email=${email}">Clique aqui</a>
        </p>
            
      `
    });

    if (error) {
      return Response.json({ error }, { status: 500 });
    }

    return Response.json(data);
  } catch (error) {
    return Response.json({ error }, { status: 500 });
  }
}