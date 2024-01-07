import {
    fetchFilteredPractices,
    fetchPracticesPageAmount,
} from '@/data/practice'
import PracticeTableCell from './practice-table-cell'
import { DataTablePagination } from '@/components/table/data-table-pagination'

type PracticesTableProps = {
    query: string
    currentPage: number
    size:number
}

export default async function PracticesTable({
    query,
    currentPage,
    size,
}: PracticesTableProps) {
    const practices = await fetchFilteredPractices(query, currentPage, size)
    const {totalPages, count} = await fetchPracticesPageAmount(query, size )


    return (
        <>
            <div className="flex flex-col gap-2">
                {practices.map((practice) => (
                    <PracticeTableCell practice={practice} key={practice.id} />
                ))}
            </div>
            <DataTablePagination totalPages={totalPages}  totalData={count}  />
        </>
    )
}
