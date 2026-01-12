import './unique.css'
import './responsive.css'


export default function OpenTournments() {
    return (
        <>
            <div id="tournaments">
                <h1>Torneios abertos para inscrição</h1>
                <div id='div-search-bar'>
                    <input type="text" />
                    <div id='icon-search'>
                        <img src="/icons/search.png" alt="search" />
                    </div>
                </div>


                {Array.from({ length: 7 }).map((_, i) => (
                // i é o número de repetição do negócio
                <div className="tournament" key={i}>
                    <div className="contentImg">
                    <div className="content">
                        <h3>IV TORNEIO BLITZ SOMBRIO</h3>
                        <p>
                            Tempo: 3 + 5 (digital) / 10 + 0 (analógico) <br />
                            <br />
                            Local: CITI, Rua João Goularte, Sombrio. <br />
                            <br />
                            Encerramento das inscrições:<br />
                            Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora:  18:00<br />
                            <br />
                            Início:<br />
                            Data: 28/08/2025&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;Hora: 18:30<br />
                            <br />
                            Valor: R$10,00 - R$25,00
                        </p>
                    </div>
                    <img src="/folderteste.jpeg" alt="torneio" />
                    </div>
                    <div className="buttons">
                    <div>
                        <a href="#" className="button red">Inscreva-se</a>
                    </div>
                    <div style={{flexDirection: 'column', width: 'min-content'}}>
                        <a href="#" className="button black">Inscrição em grupo</a>
                        <p className="obs">*Há descontos disponíveis para determinados volumes de inscrições.</p>
                    </div>
                    </div>
                </div>  
                ))}
            </div>
        </>
    )
}