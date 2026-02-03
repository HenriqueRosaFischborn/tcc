
import db from "./db"
import * as argon2 from "argon2"



export default async function findUserByCredentials(email: string, password: string) {

    const user = await db.usuario.findUnique({
        where: {
            email: email
        }
    })

    if (!user) {
        return null
    } else {
        
        const verify = await argon2.verify(user.password, password)

        if (verify) {
            return {id: String(user.id), email: user.email, admin: user.admin}
        } else {
            return null
        }
    }
}