'use server'

import db from '@/lib/db';
import { Player } from '@/lib/types';
import { Resend } from 'resend';
import CancelSolicitationEmail from '../../email-elements/cancel-solicitation';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendCancelSolicitation(inscricao: Player, torneioTitle: string, torneioID: number) {
    console.log('enviando email...')

    const emailsData = await db.emails.findMany({
      where: {
        id_torneio: torneioID
      },
      select: {
        email: true
      }
    })

    const emails = emailsData.map(el => el.email)
    
    const html = await render(CancelSolicitationEmail({ inscricao, torneioTitle }))
    
    try {
    const { data, error } = await resend.emails.send({
      from: `CXA - Clube de Xadrez de Araranguá <cancelsolicitation@testetcc.com.br>`,
      to: emails,
      subject: 'Solicitação de cancelamento de inscrição',
      html: html
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