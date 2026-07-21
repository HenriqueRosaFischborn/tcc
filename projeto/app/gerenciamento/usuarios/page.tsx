import db from "@/lib/db";
import UsersTable from "./usersTable";
import { auth } from "@/auth";

export default async function Users() {
    const session = await auth()
    
    const usuarios = await db.usuario.findMany({
        where: {
            email: {
                not: session?.user.email
            }
        }
    });

    return <UsersTable usuarios={usuarios} />;
}