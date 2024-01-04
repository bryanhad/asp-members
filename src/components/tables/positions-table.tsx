import {
    fetchFilteredPositions,
    fetchPositionsPageAmount,
} from '@/data/position'
import Link from 'next/link'
import TablePagination from './table-pagination'

type PositionsTableProps = {
    query: string
    currentPage: number
}

export default async function PositionsTable({
    query,
    currentPage,
}: PositionsTableProps) {
    const positions = await fetchFilteredPositions(query, currentPage)
    console.log({positions, query, currentPage})

    const totalPages = await fetchPositionsPageAmount(query)

    return (
        <>
            <div className="flex flex-col gap-2">
                {positions.map((position) => (
                    <div
                        key={position.id}
                        className="flex items-center justify-between px-6 py-2 rounded-md bg-secondary"
                    >
                        <p>{position.name}</p>
                        <div className="flex flex-col items-center gap-1">
                            <p className="text-secondary-foreground/20 text-sm">
                                Member count:
                            </p>
                            <p>{position._count.members}</p>
                        </div>
                    </div>
                ))}
            </div>
            <TablePagination totalPages={totalPages} />
        </>
    )
}
