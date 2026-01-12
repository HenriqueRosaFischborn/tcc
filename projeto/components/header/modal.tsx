import FormModal from '../forms/form-modal'
import './modal.css'


export default function Modal( { onClose }: { onClose: () => void }) {
    
    return (
        <>
            <div id="overlay" onClick={onClose}>
                <div id="modal" onClick={(e) => e.stopPropagation()}>
                    <div id='modal-absolute' style={{justifyContent: 'space-between', width: '90%'}}>
                        <div style={{alignItems: 'center', gap: '10px', cursor: 'pointer'}} onClick={onClose}>
                            <img src="/icons/arrow.png" alt="arrow" style={{width: '25px'}}/>
                            <h4>Voltar</h4>
                        </div>
                        <img id='userImg' src="/icons/user.png" alt="logo" style={{width: '70px'}}/>
                    </div>
                    
                    <h1>Meu Perfil</h1>
                    <h2>Gerencie suas informações pessoais</h2>
                    <div id='content' style={{flexDirection: 'column'}}>
                        <h4 style={{width: '100%', textAlign: 'left'}}>Alterações disponíveis</h4>
                        <FormModal />
                    </div>

                </div>
            </div>
        </>
    )
}