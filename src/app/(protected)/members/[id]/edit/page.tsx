import { getMemberByIdWithPositionAndPractices } from '@/data/member'
import { getAllPositions } from '@/data/position'
import { getAllPractices } from '@/data/practice'
import EditMemberForm from './form'

type EditMemberPageProps = {
    params: { id: string }
}

export default async function EditMemberPage({
    params: { id },
}: EditMemberPageProps) {
    const member = await getMemberByIdWithPositionAndPractices(id)
    const positions = await getAllPositions()
    const practices = await getAllPractices()

    return <EditMemberForm positions={positions} member={member} practices={practices} />
}
