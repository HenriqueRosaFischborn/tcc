import './unique.css'
import './responsive.css'
import redirectTournment from './redirect'
import { redirect } from 'next/navigation'

export default async function layoutTorneio({children, params}: {children: React.ReactNode, params: Promise<{ torneio: string }>}) {
    const {torneio} = await params

    const redirectV = await redirectTournment(torneio)
    if (redirectV) {
        redirect('/torneios-abertos')
    }

    return (
        <>
            <div id='bars-content' style={{width: '100%', height: '100%', justifyContent: 'center'}}>
                <div id='form-content'>
                    <h1 style={{width: '100%', textAlign: 'start'}}>IV CIRCUITO BLITZ SOMBRIO</h1>
                    <div id='informations'>
                        <div id='l1' style={{marginBottom: '20px', gap: '30px'}}>
                            <div style={{flexDirection: 'column', gap: '30px'}}>
                                <h2 id='info' style={{textAlign: 'start', fontSize: '22pt'}}>Informações do torneio:</h2>
                                <a href="#" className='button red'>Regulamento</a>
                                <p>
                                    Tempo: 3 + 5 <br />
                                    Local: CITI, Rua João Goularte, Sombrio <br />
                                    <br />
                                    Encerramento das inscrições: <br />
                                    Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora:  18:00 <br />
                                    <br />
                                    Início: <br />
                                    Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora: 19:05
                                </p>
                            </div>
                            <img id='folder-img' src="/folderteste.jpeg" alt="folder" fetchPriority='low' loading='lazy' decoding='async'/>
                        </div>
                        <div id='l2' style={{ flexDirection: 'column', alignItems: 'start', rowGap: '30px'}}>
                            <h2>Realizar nova inscrição:</h2>
                            <p className="error">Preencha todos os campos obrigatórios (*)</p>
                            <p className="error">*Em caso de uso de ID FIDE, preencha as informações exatamente como declaradas oficialmente: <br/>
                            <a className='fide-link' href="https://ratings.fide.com/" target='_blank' >Clique aqui, forneça seu ID FIDE e veja como suas informações <br/> estão oficialmente cadastradas</a> </p>

                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}