import db from "@/lib/db"


export default async function redirectTournment(tournmentName: string) {
    const name = tournmentName.split('~').join(' ')

    const tournment = await db.torneio.findUnique({
        where: {
            title: name
        },
        include: {
            tempo_torneio_time_digitalTotempo: {
                select: {
                    time: true,
                    plus: true
                }
            },
            tempo_torneio_time_analogTotempo: {
                select: {
                    time: true,
                    plus: true
                }
            }
        }
    })
    
    return tournment

}