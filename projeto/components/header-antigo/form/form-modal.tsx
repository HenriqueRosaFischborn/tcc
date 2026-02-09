'use client'

import deleteAccount from "@/app/api/action/delete-account";
import changeInformations from "@/app/api/action/change-informations";
import Form from "next/form";

export default function FormModal () {
    return (
        <>
            <Form style={{paddingTop: '20px', paddingBottom: '10px', alignItems: 'center'}} action={changeInformations}>

                <div style={{width: '100%'}}>
                    <label htmlFor="email">Email:</label>
                    <input type="email" defaultValue={'teste@gmail.com'} name="email"/>
                </div>

                <div style={{width: '100%'}}>
                    <label htmlFor="olg-password">Senha antiga:</label>
                    <input type="password" name="olg-password"/>
                </div>
                <div style={{width: '100%'}}>
                    <label htmlFor="new-password">Nova senha:</label>
                    <input type="password" name="new-password"/>
                </div>
                <button className="button red" type="submit">Atualizar informações</button>
            </Form>
            <Form action={deleteAccount}>
                <button id="delete-account"  type="submit">Deletar conta</button>
            </Form>
        </>
    )
}