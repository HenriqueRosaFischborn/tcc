import db from "@/lib/db"


export default async function approvedMP(payment: any) {
    
    const uuid = payment.external_reference 
    console.log(uuid)

    try {
        await db.incricao.update({
            where: {
                uuid: uuid
            },
            data: {
                status: 'confirmed'
            }
        })


    } catch {
        return {}
    }
} 