'use client'

import InputDate from "@/components/ui/input-date"
import { SelectCategorie } from "./selectCategorie"
import { usePathname } from "next/navigation"


export default function Fields(player?: any) {
    const pathname = usePathname()

    return (
        <>
            <div style={{width: '70%'}}>
                <label htmlFor="name">Nome:</label>
                <input type="text" name="name" {...(pathname.includes('em-grupo') ? {
                    onChange: (e) => {
                        const father = e.currentTarget.parentElement?.parentElement?.parentElement?.parentElement?.firstChild?.firstChild
                        if (!(father instanceof HTMLElement)) return //isso serve pra ele identificar como elemento html
                        father.innerText = e.currentTarget.value
                        if (father.innerText == '') father.innerText = 'Henrique'
                    }
                } :{})} defaultValue={player.players?.name}/> 
            </div>
            
            {pathname.includes('em-grupo') ? ('') : (
                <>
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="city">Cidade que representa:</label>
                        <input type="text" name="city" />
                    </div>
                    
                    <div style={{width: 'calc(50% - 15px)'}}>
                        <label htmlFor="team">Clube que representa (se houver):</label>
                        <input type="text" name="team"/>
                    </div>
                </>
            )}

            <SelectCategorie />

            <div style={{width: 'calc(50% - 15px)'}}>
                <label htmlFor="idfide">ID Fide:</label>
                <input type="text" maxLength={8} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} />
            </div>

            <div style={{width: 'calc(50% - 15px)'}}>
                <label htmlFor="idcbx">ID CBX:</label>
                <input type="text" maxLength={8} onInput={(e) => e.currentTarget.value = e.currentTarget.value.replace(/\D/g, '')} name="idcbx" />
            </div>      
        </>
    )
}