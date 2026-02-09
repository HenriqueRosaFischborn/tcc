'use client'


export default function QrDiv({qr_key, qr_src, status, email}: {qr_key?: string, qr_src?: string, status?: string, email?: string}) {
    return (
        <>
            <div id="qr-div" >
                
                {status == 'confirmed' ? (
                    <>
                        <h2>Seu pagamento foi confirmado!!!</h2>
                        <img src="/icons/payment-succes.png" alt="" fetchPriority='low' loading='lazy' decoding='async'/>
                        <h3>Sua inscrição foi confirmada com sucesso, fique atento ao seu email <span className="error">{email}</span>, você será contatado em caso de qualquer irregularidade em sua inscrição</h3>
                    </>
                ) : (
                    <>
                    
                        <h2>Efetuar pagamento e confirmar inscrição:</h2>
                        <h3>(Recarregue a página após realizar o pagamento)</h3>
                        <img src={`data:image/png;base64,${qr_src}`} alt="qrcode" />
                        <div id="qr-key">
                            <p><strong>Ou copie o código:</strong></p>
                            <div className="input">
                                <p>{qr_key}</p>
                                <img src="/icons/copy.png" alt="copy" onClick={() => {
                                    navigator.clipboard.writeText(String(qr_key))
                                    alert('Copiado para área de transferência...')
                                }}/>
                            </div>
                        </div>
                        <p>
                            Escaneie o QRcode com sua conta bancária ou use a chave PIX e confirme sua inscrição<br />
                            <br />
                            Você receberá um email algum tempo depois que o pagamento for efetuado
                        </p>
                    </>
                )}
            </div>
        </>
    )
}