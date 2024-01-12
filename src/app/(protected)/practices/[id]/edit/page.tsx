import { getPracticeById } from '@/data/practice'
import EditPracticeForm from './form'
import { currentRole } from '@/lib/auth'

type EditPracticePageProps = {
    params: { id: string }
}

export default async function EditPracticePage({
    params: { id },
}: EditPracticePageProps) {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }
    const practice = await getPracticeById(id)

    return (
        <div>
            <EditPracticeForm practice={practice} />
        </div>
    )
}
