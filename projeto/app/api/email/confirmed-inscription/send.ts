export const runtime = 'nodejs'


import { EmailTemplate } from '@/email-template/reset-password';
import { Player } from '@/lib/types';
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendConfirmedMessageEmail(inscricao: Player, torneio: string) {
    console.log('enviando email...')
    
    try {
    const { data, error } = await resend.emails.send({
      from: `Henrique <confirmedmessage@testetcc.com.br>`,
      to: [inscricao.usuario.email],
      subject: 'Inscrição confirmada',
      html: `
        <p>
          Olá, sua inscrição foi confirmada<br/>
          <br/>
          Torneio: ${torneio}<br/>
          Categoria: ${inscricao.categoria.name}<br/>
          <br/>
          Dados da inscrição:<br/>
          <br/>
          Nome: ${inscricao.name} <br/>
          Data de nascimento: ${new Date(inscricao.data_nasc).toLocaleDateString('pt-BR', {timeZone: 'UTC'})} <br/>
          Gênero: ${inscricao.genre ? 'Masculino' : 'Feminino'} <br/>
          Cidade que representa: ${inscricao.city} <br/>
          Clube que representa: ${inscricao.club} <br/>
          ID FIDE: ${inscricao.id_fide} <br/>
          ID CBX: ${inscricao.id_cbx} <br/>
          Rating FIDE: ${inscricao.rtg_fide} <br/>
          Rating CBX: ${inscricao.rtg_cbx} <br/>
        </p>       
      `
    });

    console.log('resultado resend')
    console.log({ data, error })

    if (error) {
        console.log('Erro no email', error)
        return { success: false, error }
    }

    return { success: true, data }
  } catch (error) {
    return { success: false, error }
  }
}