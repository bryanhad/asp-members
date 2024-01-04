import AddForm from '@/app/(protected)/positions/_components/add-form'
import PositionsTable from '@/app/(protected)/positions/_components/positions-table'

type PositionPageProps = {
    searchParams?: {
        q?: string
        page?: string
    }
}

export default function PositionsPage({ searchParams }: PositionPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1

    return (
        <div className="space-y-4">
            <AddForm />
            <PositionsTable query={query} currentPage={currentPage} />
        </div>
    )
}
