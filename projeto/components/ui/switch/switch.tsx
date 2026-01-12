'use client'

import './unique.css'

type Tournment = {
    title: string,
    state: boolean,
    time: string,
    local: string,
    localLink: string,
    dateEvent: Date,
    dateInscri: Date,
    priceMin: number,
    priceMax: number,
    srcFolder: string
}

export default function Switch({defaultChecked, onClick, el, colorOn, colorOff}: {defaultChecked?: boolean, onClick?: Function, el?: any, colorOn: string, colorOff: string}) {

    function changeColor(el: HTMLInputElement) {
        const x = el.parentElement?.querySelector('.slider')
        if (!(x instanceof HTMLElement)) return
        
        if (el.checked) {
            x.style.backgroundColor = colorOn
        } else {
            x.style.backgroundColor = colorOff
        }
    }
    
    return (
        <>
            <label className="switch">
                <input type="checkbox" onClick={onClick? (e) => {onClick(e, el); changeColor(e.currentTarget)} : undefined} defaultChecked={defaultChecked ? true : false} />
                <span className="slider" style={{
                    backgroundColor: `${defaultChecked ? colorOn : colorOff}`
                }}></span>
            </label>
        </>
    )
}