import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/columns'
import { fetchFilteredUsers, fetchUsersPageAmount } from '@/data/user'
import { DataTable } from '@/components/table/data-table'
import { OnlyShowToAdmin } from '@/components/auth/only-show-to-admin'

type UsersPageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?: string
    }
}

export default async function UsersPage({ searchParams }: UsersPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    const { totalPages, count } = await fetchUsersPageAmount(query, tableSize)

    const data = await fetchFilteredUsers(query, currentPage, tableSize)

    return (
        <div className="space-y-4">
            <OnlyShowToAdmin>
                <Button asChild>
                    <Link href="/users/add">Add New User</Link>
                </Button>
            </OnlyShowToAdmin>
            <DataTable
                columns={columns}
                data={data}
                totalPages={totalPages}
                totalData={count}
            />
        </div>
    )
}
