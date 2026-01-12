'use client'
import './unique.css'
import './responsive.css'

import MenuListAdmin from './menu';
import { useState } from 'react';

export default function MenuAdmin({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
    
  const [open, setOpen] = useState(false)
  
  return (
        <>
            <div id="side-bar">
              
              <h2 id='title-admin'>Gerenciamento</h2>
              <div id='desktop' style={{width: '100%'}}>
                <MenuListAdmin />
              </div>
              
              {open ? (  
                <div id='cell' style={{width: '100%'}}>
                  <MenuListAdmin />
                </div>
              ) : ('')}

              <div id='arrow-bottom'  onClick={() => {
                setOpen(!open)
              }}>
                <img  src="/icons/arrow-white.png" alt="arrow"/>
              </div>


            </div>
            <div className='content'>
                {children}
            </div>
        </>
    )
}