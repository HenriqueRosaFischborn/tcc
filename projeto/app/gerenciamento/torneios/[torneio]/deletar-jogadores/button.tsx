'use client'
import { deleteTournment } from "./action"


export default function DeleteButton({id}: {id: number}) {
    return (
        <>
            <button onClick={async (e) => {
                if (confirm("Tem certeza que deseja deletar este torneio? Todas as informações e todos os jogadores inscritos serão permanentemente excluídos")) {
                    await deleteTournment(id)
                    window.location.reload()
                }
            }} className='button black'>Deletar torneio</button>
        </>
    )
}