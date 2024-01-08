import { getPracticeById } from '@/data/practice'
import EditPracticeForm from './form'

type EditPracticePageProps = {
    params: { id: string }
}

export default async function EditPracticePage({
    params: { id },
}: EditPracticePageProps) {
    const practice = await getPracticeById(id)

    return (
        <div>
            <EditPracticeForm practice={practice} />
        </div>
    )
}
