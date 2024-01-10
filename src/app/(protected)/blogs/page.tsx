import { DataTable } from '@/components/table/data-table'
import { Button } from '@/components/ui/button'
import { fetchBlogsPageAmount, fetchFilteredBlogs } from '@/data/blog'
import { fetchFilteredMembers } from '@/data/member'
import Link from 'next/link'
import React from 'react'
import { columns } from './_components/columns'
// import { columns } from './_components/columns'
// import { fetchFilteredBlogs, fetchBlogsPageAmount } from '@/data/blog'
// import { DataTable } from '@/components/table/data-table'

type BlogsPageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?: string
    }
}

export default async function BlogsPage({ searchParams }: BlogsPageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    const {totalPages, count} = await fetchBlogsPageAmount(query, tableSize)

    const data = await fetchFilteredBlogs(query, currentPage, tableSize)

    return (
        <div className="space-y-4">
            <Button asChild >
                <Link href="/blogs/add">Add New Blog</Link>
            </Button>
            <DataTable columns={columns} data={data} totalPages={totalPages} totalData={count} />
        </div>
    )
}
