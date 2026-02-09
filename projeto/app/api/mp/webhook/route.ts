// import { MercadoPagoConfig, Payment } from "mercadopago"
import db from "@/lib/db";
import approvedMP from "../aproved"

// const client = new MercadoPagoConfig({
//   accessToken: process.env.MP_ACCESS_TOKEN!,
// })

// const paymentClient = new Payment(client)

export async function POST(req: Request) {
  const txt = await req.text()
  const body = JSON.parse(txt)
  
    
    if (body.type === 'payment') {

      try{
        if (!body.data.id) {
          return new Response('Erro', {status: 200})
        }

        const response = await fetch(`https://api.mercadopago.com/v1/payments/${body.data.id}`, {
          headers: {
            Authorization: `Bearer ${process.env.ACCESS_TOKEN}`,
          },
        });

        const paymentData = await response.json();

        console.log('Status do pagamento:', paymentData.status);

        if (paymentData.status === 'approved') { 
          //pagamento aprovado, faz isso:
          await approvedMP(paymentData)

          await db.ids_mp.create({
            data: {
              id_mp: body.data.id,
              id_individual: paymentData.external_reference
            }
          })
        } else {
          return new Response('Erro', {status: 200})
        }

      } catch {
        return new Response('Erro', {status: 200})
      }
      return new Response('ok', {status: 200})
    }
  return new Response('ok', {status: 200})
}