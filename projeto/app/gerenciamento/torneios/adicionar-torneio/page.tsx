import './unique.css'
import './responsive.css'
import AddTournmentForm from './form/form'
import getTimes from './getTimes'


export default async function AddTournment() {
    
    const times = await getTimes()
    
    return (
        <>
            <AddTournmentForm times={times}/>
        </>
    )
}