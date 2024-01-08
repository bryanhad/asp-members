import { getMemberByIdWithPositionAndPractices } from '@/data/member'
import MemberView from '../_components/view'

type ViewMemberPageProps = {
    params: { id: string }
}

export default async function ViewMemberPage({
    params: { id },
}: ViewMemberPageProps) {
    const member = await getMemberByIdWithPositionAndPractices(id)

    return (
        <div>
            <MemberView member={member} />
        </div>
    )
}
