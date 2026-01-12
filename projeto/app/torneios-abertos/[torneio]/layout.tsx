import './unique.css'
import './responsive.css'

export default function layoutTorneio({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
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
                            <img id='folder-img' src="/folderteste.jpeg" alt="folder" />
                        </div>
                        <div id='l2' style={{ flexDirection: 'column', alignItems: 'start', rowGap: '30px'}}>
                            <h2>Realizar inscrição:</h2>
                            {children}
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}