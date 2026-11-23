'use server'

import { requireAdmin } from "@/lib/auth-guard"
import db from "@/lib/db"
import { getSupabaseAdmin } from "@/lib/supabase"

/**
 * Exclusão de uma única inscrição, pelo botão da última coluna da tabela de
 * análise de jogadores.
 *
 * O cliente manda apenas o `uuid` da linha; nada mais do payload é aproveitado.
 * A exclusão atinge uma linha só — as outras inscrições do torneio e o torneio
 * em si ficam intactos — e leva junto o comprovante anexado por aquele jogador.
 *
 * Rota administrativa: sem administrador, `requireAdmin` lança e nada é apagado.
 * Como Server Actions são endpoints POST públicos, esta é a única barreira que
 * separa o botão de um DELETE anônimo.
 */

/** Mesmo formato exigido pela coluna `uuid` (chave primária da inscrição). */
const FORMATO_UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

export type DeleteInscricaoResult = {
    ok: boolean
    message: string
}

export default async function deleteInscricao(uuid: string): Promise<DeleteInscricaoResult> {
    await requireAdmin()

    if (typeof uuid !== 'string' || !FORMATO_UUID.test(uuid)) {
        return { ok: false, message: 'Inscrição inválida.' }
    }

    // O caminho do comprovante no Storage é montado com o torneio e o dono da
    // inscrição, então a linha precisa ser lida antes de sair do banco. É a
    // mesma montagem usada em `page.tsx` para exibir o comprovante.
    const inscricao = await db.incricao.findUnique({
        where: { uuid },
        select: { id_torneio: true, id_usuario: true }
    })

    if (!inscricao) {
        return { ok: false, message: 'Inscrição não encontrada. Recarregue a página e tente de novo.' }
    }

    const caminhoComprovante = `comprovantes/${inscricao.id_torneio}/${inscricao.id_usuario}/${uuid}`

    const supabaseAdmin = await getSupabaseAdmin()

    // Storage antes do banco, de propósito: se o arquivo não sair, a inscrição
    // continua no banco e o administrador pode tentar de novo. A ordem inversa
    // deixaria um comprovante órfão, sem nenhuma linha apontando para ele.
    //
    // `remove` de um caminho inexistente (jogador que não anexou nada) não é
    // erro — a resposta volta com a lista vazia.
    const { error } = await supabaseAdmin.storage
        .from('publics')
        .remove([caminhoComprovante])

    if (error) {
        console.error('deleteInscricao: falha ao apagar comprovante', {
            caminhoComprovante,
            motivo: error.message
        })

        return {
            ok: false,
            message: 'Não foi possível apagar o comprovante da inscrição. Nada foi deletado; tente de novo.'
        }
    }

    // `deleteMany` com a chave primária em vez de `delete`: a contagem devolvida
    // diz se a linha existia, sem precisar distinguir a exceção de "registro não
    // encontrado" do Prisma de um erro de verdade. A cláusula `where` é só o
    // uuid — nenhuma outra inscrição entra na exclusão.
    const { count } = await db.incricao.deleteMany({ where: { uuid } })

    if (count === 0) {
        return { ok: false, message: 'Inscrição não encontrada. Recarregue a página e tente de novo.' }
    }

    return { ok: true, message: 'Inscrição deletada.' }
}
