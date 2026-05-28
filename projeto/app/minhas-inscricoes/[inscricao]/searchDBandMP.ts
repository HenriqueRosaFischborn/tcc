'use server'

import db from "@/lib/db"
import { Info } from "@/lib/types"


export async function searchCatInscri(uuid: string): Promise <Info> {

    try {
        const inscri = await db.incricao.findFirst({
            where: {
                uuid: uuid
            }
        })

        if (!inscri) return {erro: 'Essa inscrição não existe'}
    
        const cat = await db.categoria.findUnique({
            where: {
                uuid: inscri.uuid_cat
            }
        })
    
        if (!cat) return {erro: 'Erro'}

        
        if (inscri.status == 'pending') {

            const client = new MercadoPagoConfig({
                accessToken: process.env.ACCESS_TOKEN as string,
                options: { 
                    timeout: 5000,
                },
            })

            const user = await db.usuario.findUnique({
                where: {id: inscri.id_usuario}
            })
            if (!user) return {erro: 'erro'}


            const payment = new Payment(client)
        
            const body = {
                transaction_amount: Number(cat.value),
                notification_url: 'https://f20c-2804-ef4-53d2-db00-2c74-f237-b266-aca0.ngrok-free.app/api/mp/webhook',
                description: 'teste tcc',
                external_reference: String(uuid),
                payment_method_id: 'pix',
                payer: {
                    email: user.email
                },
            }
        
            try {
                const response = await payment.create({ body })
                
        
                return {
                    name: inscri.name,
                    borndate: inscri.data_nasc.toLocaleDateString('pt-BR'),
                    idfide: inscri.id_fide ? Number(inscri.id_fide) : null,
                    idcbx: inscri.id_cbx ? Number(inscri.id_cbx) : null,
                    catname: cat.name,
                    value: cat.value,
                    
                    status: inscri.status,
                    key_code: response?.point_of_interaction?.transaction_data?.qr_code,
                    qr_code: response.point_of_interaction?.transaction_data?.qr_code_base64
                }
            } catch {
                console.log('Erro no pagamento')
                return {
                    message: ['erro no pagamento']
                }
            }
        } else {
            return {
                name: inscri.name,
                borndate: inscri.data_nasc.toLocaleDateString('pt-BR'),
                idfide: inscri.id_fide ? Number(inscri.id_fide) : null,
                idcbx: inscri.id_cbx ? Number(inscri.id_cbx) : null,
                status: inscri.status,
                catname: cat.name,
                value: cat.value,
            }
        }
    } catch {
        return {erro: 'Essa inscrição não existe'}
    }
}