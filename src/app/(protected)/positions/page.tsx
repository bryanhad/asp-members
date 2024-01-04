import PositionForm from '@/components/forms/position-form'
import PositionsTable from '@/components/tables/positions-table'

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
        <div className='space-y-4'>
            <PositionForm />
            <PositionsTable query={query} currentPage={currentPage} />
        </div>
    )
}
