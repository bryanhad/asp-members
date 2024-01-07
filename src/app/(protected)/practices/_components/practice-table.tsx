import {
    fetchFilteredPractices,
    fetchPracticesPageAmount,
} from '@/data/practice'
import TablePagination from '../../../../components/table/table-pagination'
import PracticeTableCell from './practice-table-cell'

type PracticesTableProps = {
    query: string
    currentPage: number
}

export default async function PracticesTable({
    query,
    currentPage,
}: PracticesTableProps) {
    const practices = await fetchFilteredPractices(query, currentPage)
    const totalPages = await fetchPracticesPageAmount(query)


    return (
        <>
            <div className="flex flex-col gap-2">
                {practices.map((practice) => (
                    <PracticeTableCell practice={practice} key={practice.id} />
                ))}
            </div>
            <TablePagination totalPages={totalPages} />
        </>
    )
}
