import { getAllPositions } from '@/data/position'
import { getAllPractices } from '@/data/practice'
import AddMemberForm from './form'
import { currentRole } from '@/lib/auth'
import { Metadata } from 'next'

export const metadata:Metadata = {
    title: 'Add Member',
}


export default async function AddMemberPage() {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }

    const [positions, practices] = await Promise.all([
        getAllPositions(),
        getAllPractices(),
    ])

    return (
        <div>
            <AddMemberForm positions={positions} practices={practices} />
        </div>
    )
}
