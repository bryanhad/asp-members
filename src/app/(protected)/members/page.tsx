import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/columns'
import { DataTable } from './_components/data-table'
import { fetchFilteredMembers, fetchMembersPageAmount } from '@/data/member'

type MembersPageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?: string
    }
}

export default async function MembersPage({ searchParams }: MembersPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    const {totalPages, count} = await fetchMembersPageAmount(query, tableSize)

    const data = await fetchFilteredMembers(query, currentPage, tableSize)

    return (
        <div className="space-y-4">
            <Button asChild >
                <Link href="/members/add">Add New Member</Link>
            </Button>
            <DataTable columns={columns} data={data} totalPages={totalPages} totalData={count} />
        </div>
    )
}
