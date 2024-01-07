import AddForm from './_components/add-form'
import PracticesTable from './_components/practices-table'

type PracticePageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?:string
    }
}
export default async function PracticesPage({ searchParams }: PracticePageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    return (
        <div className="space-y-4">
            <AddForm />
            <PracticesTable size={tableSize} query={query} currentPage={currentPage} />
        </div>
    )
}
