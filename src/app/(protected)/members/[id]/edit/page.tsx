import { getMemberById, getMemberByIdWithPractices } from '@/data/member'
import { getAllPositions } from '@/data/position'
import EditMemberForm from './form'
import { getAllPractices } from '@/data/practice'

type EditMemberPageProps = {
    params: { id: string }
}

export default async function EditMemberPage({
    params: { id },
}: EditMemberPageProps) {
    const member = await getMemberByIdWithPractices(id)
    const positions = await getAllPositions()
    const practices = await getAllPractices()

    return <EditMemberForm positions={positions} member={member} practices={practices} />
}
