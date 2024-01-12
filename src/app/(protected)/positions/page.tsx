import DataTableSearch from '@/components/table/data-table-search'
import AddForm from './_components/add-form'
import PositionsTable from './_components/positions-table'

type PositionPageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?:string
    }
}

export default async function PositionsPage({ searchParams }: PositionPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    return (
        <div className="space-y-4">
            <DataTableSearch placeholder='Search by name..'/>
            <AddForm />
            <PositionsTable size={tableSize} query={query} currentPage={currentPage} />
        </div>
    )
}
