'use client'

import InputDate from "@/components/ui/input-date"
import { Playwrite_CA_Guides } from "next/font/google"
import React from "react"



export function SelectCategorie() {
    
    
    
    function divClick(e: React.MouseEvent) {
        const x = e.currentTarget.querySelector('input')

        if (!x) return

        x.checked = true
    }
    
    return (

        <>
            <div style={{width: '35%'}}>
                <label htmlFor="borndate">Data de nascimento:</label>
                <InputDate />
            </div>
            
            <div className="genre" style={{flexDirection: 'column', alignItems: 'start'}}>
                <div style={{flexDirection: 'row', gap: '10px', cursor: 'pointer'}} onClick={divClick}>
                    <input type="radio" name="genre" /><h3>Masculino</h3>
                </div>
                <div style={{flexDirection: 'row', gap: '10px', cursor: 'pointer'}} onClick={divClick}>
                    <input type="radio" name="genre" /><h3>Feminino</h3>
                </div>
            </div>

            <p className="obs" style={{marginTop: '-25px'}}>*Preencha a data de nascimento e o gênero para obter sua categoria</p>

            <div className="div-categorie" style={{width: '100%', flexDirection: 'row', gap: '30px'}}>
                <div style={{width: 'calc(50% - 15px)', alignItems: 'start'}}>
                    <label htmlFor="">Categoria:</label>
                    
                    <div className="categorie input">
                        <h3 style={{textAlign: 'start'}}>Sub 8 - Masculino - R$15,00</h3>
                    </div>

                    <p className="obs">*A categoria selecionada pode não corresponder exatamente a sua idade por não estar disponível neste torneio. Nesse caso, o sistema escolherá automaticamente a categoria mais adequada</p>  
                </div>
            
                <div className="division" style={{width: 'calc(50% - 15px)'}}>
                    <label htmlFor="division">Divisão:</label>
                    <div style={{flexDirection: 'row', gap: '10px', alignItems: 'center', cursor: 'pointer'}} onClick={divClick}>
                        <input type="radio" name="division" /><div style={{flexDirection:'row', gap:'10px', alignItems: 'center'}}><h3>Escolar</h3><p className="obs">(recomendado)</p></div>
                    </div>
                    <div style={{flexDirection: 'row', gap: '10px', alignItems: 'center', cursor: 'pointer'}} onClick={divClick}>
                        <input type="radio" name="division" /><h3>Superior</h3>
                    </div>
                </div>
            </div>
        </>
    )
}