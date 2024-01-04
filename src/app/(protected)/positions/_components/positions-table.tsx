import {
    fetchFilteredPositions,
    fetchPositionsPageAmount,
} from '@/data/position'
import TablePagination from '../../../../components/table/table-pagination'
import PositionTableCell from './position-table-cell'

type PositionsTableProps = {
    query: string
    currentPage: number
}

export default async function PositionsTable({
    query,
    currentPage,
}: PositionsTableProps) {
    const positions = await fetchFilteredPositions(query, currentPage)

    const totalPages = await fetchPositionsPageAmount(query)

    return (
        <>
            <div className="flex flex-col gap-2">
                {positions.map((position) => (
                    <PositionTableCell position={position} key={position.id} />
                ))}
            </div>
            <TablePagination totalPages={totalPages} />
        </>
    )
}
