import db from "@/lib/db"


export default async function redirectTournment(tournmentName: string) {
    const name = tournmentName.split('~').join(' ')

    const tournment = await db.torneio.findUnique({
        where: {
            title: name
        }
    })
    
    if (!tournment) {
        return true
    } else {
        return false
    }

}