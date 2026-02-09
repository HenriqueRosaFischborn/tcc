
import './unique.css'
import './responsive.css'
import { auth } from '@/auth'
import { searchCatInscri } from './searchDBandMP'
import { Info } from '@/lib/types'
import QrDiv from './pix/pix'


export default async function inscription({params}: {params: Promise<{inscricao: string}>}) {
    const {inscricao} = await params

    const info: Info = await searchCatInscri(inscricao)

    const session = await auth()

    return(
        <>
            <h1>Detalhes da inscrição</h1>
            {info.erro ? (
                <p className='error'>Está não é uma inscrição válida</p>
            ) : (
                <>
                    <h3 style={{
                        fontWeight: '500',
                        color: 'var(--mainred)',
                        textAlign: 'start'
                    }}>Você só poderá realizar o pagamento confirmando sua inscrição até até 28/08 às 18:00</h3>
                    <div className="content" style={{width: '100%'}}>
                        <QrDiv email={String(session?.user.email)} status={String(info.status)} qr_key={String(info.key_code)} qr_src={String(info.qr_code)} />
                        <div style={{flexDirection: 'column', gap: '10px', flex: 1, minWidth: 0, width: '100%'}}>
                            <div className="info-div">
                                <div style={{flexWrap: 'wrap'}}>
                                    <h2 style={{width: '100%'}}>Detalhes do torneio:</h2>
                                    <h3 style={{width: '100%'}}>V CIRCUITO BLITZ DE SOMBRIO</h3>
                                    <p style={{width: 'fit-content'}}>
                                        Encerramento das inscrições: <br />
                                        Data: 28/08/2025&nbsp;&nbsp;&nbsp;Hora:  18:00    
                                    </p>
                                    <p style={{width: 'fit-content'}}>
                                        Início:<br />
                                        Data: 28/08/2025&nbsp;&nbsp;&nbsp; Hora: 19:05
                                    </p>
                                    <p style={{width: 'fit-content'}}>
                                        Tempo: 3 + 5<br />
                                        Local: CITI, Rua João Goularte, Sombrio
                                    </p>
                                </div>
                                <img src="/folderteste.jpeg" alt="" id='folder'/>
                            </div>
                            <div className="info-div">
                                <h2 style={{width: '100%'}}>Informações da inscrição:</h2>
                                <p style={{width: 'fit-content'}}>
                                    Nome: {info.name?.trim() == '' ? '---' : info.name}<br />
                                    <br />
                                    Data de nascimento: {info.borndate?.trim() == '' ? '---' : info.borndate}
                                </p>
                                <p style={{width: 'fit-content'}}>
                                    Rating FIDE: {info.idfide == null ? '---' : info.idfide}<br />
                                    Rating CBX: {info.idcbx == null ? '---' : info.idcbx}
                                </p>
                                <p style={{width: 'fit-content'}}>
                                    Categoria: {info.catname?.trim() == '' ? '---' : info.catname}<br />
                                    <br />
                                    Valor: {String(info.value).trim() == '' ? '---' : new Intl.NumberFormat('pt-BR', {
                                        style: 'currency',
                                        currency: 'BRL'
                                    }).format(Number(info.value))}
                                </p>
                            </div>
                            <div id='buttons'>
                                <button className='button blue'>Atualizar informações</button>
                                {info.status == 'pending' ? ('') : (
                                    <button className='button black'>Cancelar inscrição</button>
                                )}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </>
    )
} 