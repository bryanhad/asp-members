import AddForm from './_components/add-form'
import PositionsTable from './_components/positions-table'

type PositionPageProps = {
    searchParams?: {
        q?: string
        page?: string
    }
}

export default async function PositionsPage({ searchParams }: PositionPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1

    return (
        <div className="space-y-4">
            <AddForm />
            <PositionsTable query={query} currentPage={currentPage} />
        </div>
    )
}
