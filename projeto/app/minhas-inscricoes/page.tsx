import './unique.css'
import './responsive.css'


export default function MyInscriptions() {
    return (
        <>
            <div id="tournaments">
                <h1>Inscrições</h1>
                {Array.from({ length: 2 }).map((_, i) => (
                    // i é o número de repetição do negócio
                    <div className="tournament" key={i}>
                        <div className="contentImg">
                            <div className="content">
                                <h3>IV TORNEIO BLITZ SOMBRIO</h3>
                                <p>
                                    Nome: Henrique Fischborn <br />
                                    <br />
                                    Data de nascimento: 23 / 05 / 2009 <br />
                                    <br />
                                    Email: henrique@gmail.com <br />
                                    <br />
                                    Rating FIDE: 123456 <br />
                                    Rating CBX: -- <br />
                                    <br />
                                    Categoria: sub 16 (valendo FIDE) <br />
                                    <br />
                                    Valor: R$15,00 <br />
                                    <br />
                                    <strong>Você só poderá realizar sua inscrição até 28/08 às 18:00</strong>
                                </p>
                            </div>
                            <img src="/folderteste.jpeg" alt="torneio" />
                        </div>
                        <div className="buttons">
                            <div>
                                <a href="#" className="button yellow">Efetuar Pagamento</a>
                            </div>
                        </div>
                    </div>  
                ))}
                <h1>Inscrições em grupo</h1>
                {Array.from({ length: 2 }).map((_, i) => (
                    // i é o número de repetição do negócio
                    <div className="tournament" key={i}>
                        <div className="contentImg">
                            <div className="content">
                                <h3>IV TORNEIO BLITZ SOMBRIO</h3>
                                <p>
                                    Nome: Henrique Fischborn <br />
                                    <br />
                                    Data de nascimento: 23 / 05 / 2009 <br />
                                    <br />
                                    Email: henrique@gmail.com <br />
                                    <br />
                                    Rating FIDE: 123456 <br />
                                    Rating CBX: -- <br />
                                    <br />
                                    Categoria: sub 16 (valendo FIDE) <br />
                                    <br />
                                    Valor: R$15,00 <br />
                                    <br />
                                    <strong>Você só poderá realizar sua inscrição até 28/08 às 18:00</strong>
                                </p>
                            </div>
                            <img src="/folderteste.jpeg" alt="torneio" />
                        </div>
                        <div className="buttons">
                            <div>
                                <a href="#" className="button black">Cancelar inscrição</a>
                            </div>
                            <div>
                                <a href="#" className="button blue">Editar informações</a>
                            </div>
                        </div>
                    </div>  
                ))}
            </div>
        </>
    )
}