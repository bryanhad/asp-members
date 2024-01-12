import {
    fetchFilteredPositions,
    fetchPositionsPageAmount,
} from '@/data/position'
import PositionTableCell from './position-table-cell'
import { DataTablePagination } from '@/components/table/data-table-pagination'

type PositionsTableProps = {
    query: string
    currentPage: number
    size:number
}

export default async function PositionsTable({
    query,
    currentPage,
    size,
}: PositionsTableProps) {
    const positions = await fetchFilteredPositions(query, currentPage, size)
    const {totalPages, count} = await fetchPositionsPageAmount(query, size )

    return (
        <>
            <div className="flex flex-col gap-2">
                {positions.map((position) => (
                    <PositionTableCell position={position} key={position.id} />
                ))}
            </div>
            <DataTablePagination totalPages={totalPages}  totalData={count}  />
        </>
    )
}
