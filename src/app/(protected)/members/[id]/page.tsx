import { getMemberById } from '@/data/member'
import MemberView from '../_components/view'

type ViewMemberPageProps = {
    params: { id: string }
}

export default async function ViewMemberPage({
    params: { id },
}: ViewMemberPageProps) {
    const member = await getMemberById(id)
    if (!member) throw Error('bruh')

    return (
        <div>
            <MemberView member={member} />
        </div>
    )
}
