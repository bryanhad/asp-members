import { getMemberByIdWithPositionAndPractices } from '@/data/member'
import MemberView from '../_components/view'
import { currentRole } from '@/lib/auth'

type ViewMemberPageProps = {
    params: { id: string }
}

export default async function ViewMemberPage({
    params: { id },
}: ViewMemberPageProps) {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }

    const member = await getMemberByIdWithPositionAndPractices(id)

    return <MemberView member={member} />
}
