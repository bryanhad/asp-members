import { Button } from '@/components/ui/button'
import PracticesTable from './_components/practices-table'
import Link from 'next/link'
import { OnlyShowToAdmin } from '@/components/auth/only-show-to-admin'

type PracticePageProps = {
    searchParams?: {
        q?: string
        page?: string
        size?: string
    }
}
export default function PracticesPage({ searchParams }: PracticePageProps) {
    const query = searchParams?.q || ''
    const currentPage = Number(searchParams?.page) || 1
    const tableSize = Number(searchParams?.size) || 5

    return (
        <div className="space-y-4">
            <OnlyShowToAdmin>
                <Button asChild>
                    <Link href={'/practices/add'}>Add New Practice</Link>
                </Button>
            </OnlyShowToAdmin>
            <PracticesTable
                size={tableSize}
                query={query}
                currentPage={currentPage}
            />
        </div>
    )
}
