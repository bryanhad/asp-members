'use client'

import { DataTable } from '@/components/table/data-table'
import { ColumnDef } from '@tanstack/react-table'
import { useSearchParams } from 'next/navigation'

type MembersTableProps<TData, TValue> = {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    totalPages: number
    totalData: number
}

export const MembersTable = <TData, TValue>({
    columns,
    data,
    totalData,
    totalPages,
}: MembersTableProps<TData, TValue>) => {
    const searchParams = useSearchParams()
    console.log(searchParams)
    return (
        <DataTable
            columns={columns}
            data={data}
            totalPages={totalPages}
            totalData={totalData}
        />
    )
}
