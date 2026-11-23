import { beforeEach, describe, expect, it, vi } from 'vitest'

const { requireAdminMock, findUniqueMock, deleteManyMock, removeMock } = vi.hoisted(() => ({
    requireAdminMock: vi.fn(),
    findUniqueMock: vi.fn(),
    deleteManyMock: vi.fn(),
    removeMock: vi.fn()
}))

vi.mock('@/lib/auth-guard', () => {
    class UnauthorizedError extends Error {
        readonly reason: string

        constructor(reason: string) {
            super('não autorizado')
            this.name = 'UnauthorizedError'
            this.reason = reason
        }
    }

    return { requireAdmin: requireAdminMock, UnauthorizedError }
})

vi.mock('@/lib/db', () => ({
    default: { incricao: { findUnique: findUniqueMock, deleteMany: deleteManyMock } }
}))

// Cliente privilegiado do Storage: o chain `.storage.from(bucket).remove(paths)`
// é reduzido a uma função só, que registra o bucket e os caminhos recebidos.
vi.mock('@/lib/supabase', () => ({
    getSupabaseAdmin: async () => ({
        storage: {
            from: (bucket: string) => ({
                remove: (caminhos: string[]) => removeMock(bucket, caminhos)
            })
        }
    })
}))

import { UnauthorizedError } from '@/lib/auth-guard'
import deleteInscricao from '@/app/gerenciamento/torneios/[torneio]/analisar-jogadores/client/deleteInscricao'

const admin = { id: 1, email: 'admin@exemplo.com', admin: true, socio: true }

const UUID = '3f2a1b4c-5d6e-4f70-8192-a3b4c5d6e7f8'

const TORNEIO = BigInt(11)
const USUARIO = 7
const CAMINHO_COMPROVANTE = `comprovantes/${TORNEIO}/${USUARIO}/${UUID}`

beforeEach(() => {
    requireAdminMock.mockReset()
    findUniqueMock.mockReset()
    deleteManyMock.mockReset()
    removeMock.mockReset()

    // Estado feliz; cada teste sobrescreve o que precisa.
    requireAdminMock.mockResolvedValue(admin)
    findUniqueMock.mockResolvedValue({ id_torneio: TORNEIO, id_usuario: USUARIO })
    removeMock.mockResolvedValue({ error: null })
    deleteManyMock.mockResolvedValue({ count: 1 })
})

describe('deleteInscricao — autorização', () => {
    it('sem administrador, lança e não apaga nada', async () => {
        requireAdminMock.mockRejectedValue(new UnauthorizedError('forbidden'))

        await expect(deleteInscricao(UUID)).rejects.toBeInstanceOf(UnauthorizedError)
        expect(removeMock).not.toHaveBeenCalled()
        expect(deleteManyMock).not.toHaveBeenCalled()
    })

    it('sem sessão, lança e não apaga nada', async () => {
        requireAdminMock.mockRejectedValue(new UnauthorizedError('unauthenticated'))

        await expect(deleteInscricao(UUID)).rejects.toBeInstanceOf(UnauthorizedError)
        expect(removeMock).not.toHaveBeenCalled()
        expect(deleteManyMock).not.toHaveBeenCalled()
    })
})

describe('deleteInscricao — entrada inválida', () => {
    it.each([
        ['uuid que não é UUID', 'uuid-da-inscricao'],
        ['string vazia', ''],
        ['null', null as unknown as string],
        ['número', 42 as unknown as string]
    ])('recusa %s sem tocar no banco nem no Storage', async (_caso, entrada) => {
        const resultado = await deleteInscricao(entrada)

        expect(resultado.ok).toBe(false)
        expect(findUniqueMock).not.toHaveBeenCalled()
        expect(removeMock).not.toHaveBeenCalled()
        expect(deleteManyMock).not.toHaveBeenCalled()
    })

    it('inscrição que não existe mais: não tenta apagar arquivo nem linha', async () => {
        findUniqueMock.mockResolvedValue(null)

        const resultado = await deleteInscricao(UUID)

        expect(resultado.ok).toBe(false)
        expect(resultado.message).toMatch(/não encontrada/i)
        expect(removeMock).not.toHaveBeenCalled()
        expect(deleteManyMock).not.toHaveBeenCalled()
    })
})

describe('deleteInscricao — exclusão', () => {
    it('apaga o comprovante do jogador daquela inscrição', async () => {
        const resultado = await deleteInscricao(UUID)

        expect(resultado.ok).toBe(true)
        expect(removeMock).toHaveBeenCalledTimes(1)
        expect(removeMock).toHaveBeenCalledWith('publics', [CAMINHO_COMPROVANTE])
    })

    it('apaga somente a linha do uuid recebido', async () => {
        await deleteInscricao(UUID)

        // A cláusula where é o que garante "só aquela linha": nada de id_torneio
        // ou outro filtro que pudesse arrastar as demais inscrições.
        expect(deleteManyMock).toHaveBeenCalledTimes(1)
        expect(deleteManyMock).toHaveBeenCalledWith({ where: { uuid: UUID } })
    })

    it('falha ao apagar o comprovante: nada é deletado no banco', async () => {
        removeMock.mockResolvedValue({ error: { message: 'storage fora do ar' } })

        const resultado = await deleteInscricao(UUID)

        expect(resultado.ok).toBe(false)
        expect(resultado.message).toMatch(/comprovante/i)
        // Se o arquivo ficou, a inscrição também fica: o administrador tenta de novo.
        expect(deleteManyMock).not.toHaveBeenCalled()
    })

    it('linha que sumiu entre a leitura e a exclusão: avisa e não inventa sucesso', async () => {
        deleteManyMock.mockResolvedValue({ count: 0 })

        const resultado = await deleteInscricao(UUID)

        expect(resultado.ok).toBe(false)
        expect(resultado.message).toMatch(/não encontrada/i)
    })
})
