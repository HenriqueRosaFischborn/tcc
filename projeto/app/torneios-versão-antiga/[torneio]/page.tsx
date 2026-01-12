import './unique.css'
import './responsive.css'
import FormInscriIndividual from '@/components/forms/inscription/individual'


export default function TorneioAntigo() {
    return (
        <>
            <div id='bars-content' style={{width: '100%', height: '100%'}}>
                <div className='bar'></div>
                <div id='form-content'>
                    <h1 style={{width: '100%', textAlign: 'start', marginBottom: '50px'}}>IV CIRCUITO BLITZ SOMBRIO</h1>
                    <div id='informations'>
                        <div style={{flexDirection: 'column', marginBottom: '20px', gap: '30px'}}>
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
                        <div style={{width: '100%', flexDirection: 'column', alignItems: 'start', rowGap: '30px'}}>
                            <h2>Realizar inscrição:</h2>
                            <FormInscriIndividual />
                        </div>
                    </div>




                </div>
                <div className='bar'></div>
            </div>
        </>
    )
}