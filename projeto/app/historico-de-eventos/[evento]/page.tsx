import './unique.css'
import './responsive.css'


export default function Event() {
    return (
        <>
            <h1>V CIRCUITO BLITZ DE SOMBRIO</h1>
            <p id='text-event'>
                O V CIRCUITO BLITZ DE SOMBRIO, promovido pelo Sombrio Xadrez Clube, ocorreu em 12 de outubro de 2025. O evento foi realizado no Centro Cultural de Curitiba
            </p>
            <img id='img-event' src="/img-event-teste.png" alt="imagem" />
            {Array.from({length: 2}).map((el, i) => {return (
                <div key={i} className='premiation'>
                    <h2 style={{fontWeight: '600'}} >Premiações das Categorias Masculinas</h2>
                    <div className='tables-body'>
                        {Array.from({length: 5}).map((el2, i2) => {return (           
                            <table key={i2}>
                                <thead>
                                    <tr><th colSpan={2} >Sub 14</th></tr>
                                </thead>
                                <tbody>
                                    <tr><td className='podium' >1°</td> <td>Henrique R. Fischborn</td></tr>
                                    <tr><td className='podium' >2°</td> <td>João P. Machado</td></tr>
                                    <tr><td className='podium' >3°</td> <td>Pedro M. Guimarães</td></tr>
                                </tbody>
                            </table>
                        )})}
                    </div>
                </div>
            )})}
            <a id='link-photos' href="https://drive.google.com/drive/folders/1kis5pe8f5vQMEyumF1PbBd-_4II2XeMw?usp=drive_link" target='_blank'>Ver todas as fotos do evento</a>
        </>
    )
}