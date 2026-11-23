'use server'

import { signOut } from "@/auth"

/**
 * Encerra a sessão sem deixar o `signOut()` redirecionar.
 *
 * Quando o redirecionamento sai do próprio `signOut()` ele vira uma navegação
 * suave (client-side), e nela o CSS específico da home (`app/unique.css`) não
 * é aplicado — a página chega certa, mas toda sem estilo. Por isso a action
 * apenas apaga o cookie e quem chamou faz a navegação completa.
 */
export default async function logout() {
    await signOut({ redirect: false })
}
