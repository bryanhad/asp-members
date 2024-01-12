import { getAllPositions } from '@/data/position'
import { getAllPractices } from '@/data/practice'
import AddMemberForm from './form'
import { currentRole } from '@/lib/auth'

export default async function AddMemberPage() {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }

    const positions = await getAllPositions()
    const practices = await getAllPractices()

    return (
        <div>
            <AddMemberForm positions={positions} practices={practices}/>
        </div>
    )
}
