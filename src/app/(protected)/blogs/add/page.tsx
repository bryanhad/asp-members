import { getAllPractices } from '@/data/practice'
import AddblogForm from './form'

export default async function AddblogPage() {
    const categories = await getAllPractices()

    return (
        <div>
            <AddblogForm  categories={categories}/>
        </div>
    )
}
