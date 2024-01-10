import { getAllPositions } from '@/data/position'
import { getAllPractices } from '@/data/practice'
import AddMemberForm from './form'

export default async function AddMemberPage() {
    const positions = await getAllPositions()
    const practices = await getAllPractices()

    return (
        <div>
            <AddMemberForm positions={positions} practices={practices}/>
        </div>
    )
}
