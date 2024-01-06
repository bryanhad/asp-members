import { getMemberById } from '@/data/member'
import { getAllPositions } from '@/data/position'
import EditMemberForm from './form'

type EditMemberPageProps = {
    params: { id: string }
}

export default async function EditMemberPage({
    params: { id },
}: EditMemberPageProps) {
    const member = await getMemberById(id)
    const positions = await getAllPositions()

    if (!member || !positions) {
        throw new Error('bruh')
    }

    return <EditMemberForm positions={positions} member={member} />
}
