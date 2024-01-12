import { currentRole } from '@/lib/auth'
import AddPracticeForm from './form'

export default async function AddPracticePage() {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }
    return (
        <div>
            <AddPracticeForm />
        </div>
    )
}
