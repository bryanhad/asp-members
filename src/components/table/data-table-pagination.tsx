'use client'

import {
    ChevronLeftIcon,
    ChevronRightIcon,
    DoubleArrowLeftIcon,
    DoubleArrowRightIcon,
} from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'

import { Button } from '@/components/ui/button'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { createPageURL, generatePagination } from '@/lib/utils'
import Link from 'next/link'

type DataTablePaginationProps<TData> = {
    totalPages: number
    table?: Table<TData>
    totalData: number
}

export function DataTablePagination<TData>({
    totalPages,
    table,
    totalData,
}: DataTablePaginationProps<TData>) {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()
    const currentPage = Number(searchParams.get('page')) || 1
    const currentPageSize = Number(searchParams.get('size')) || 5

    // createPageUrl returns the pageUrl with the search params attached
    function generatePageUrl(
        pageNumber: number | string,
        size?: number | string,
        order?: string
    ) {
        return createPageURL(pathname, searchParams, pageNumber, size, order)
    }

    return (
        <div className="flex items-center justify-between px-2 my-4">
            {totalData && (
                <div className="flex-[1] text-sm text-muted-foreground md:block hidden">
                    {currentPageSize <= totalData ? currentPageSize : totalData}{' '}
                    of {totalData} row(s) shown.
                </div>
            )}
            <div className="flex flex-col-reverse gap-3 md:flex-row items-center justify-between flex-[1] space-x-6 lg:space-x-8">
                <div className="flex items-center space-x-2 flex-col md:flex-row gap-3">
                    <p className="text-sm font-medium">Rows per page</p>
                    {table && (
                        <Select
                            onValueChange={(value) => {
                                table.setPageSize(Number(value))
                                router.push(generatePageUrl(1, value))
                            }}
                        >
                            <SelectTrigger className="h-8 w-[70px]">
                                <SelectValue
                                    placeholder={
                                        table.getState().pagination.pageSize
                                    }
                                />
                            </SelectTrigger>
                            <SelectContent side="top">
                                {[5, 10, 15].map((pageSize) => (
                                    <SelectItem
                                        key={pageSize}
                                        value={`${pageSize}`}
                                    >
                                        {pageSize}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    )}
                </div>
                <div className="md:flex hidden w-[100px] items-center justify-center text-sm font-medium">
                    Page {currentPage} of {totalPages}
                </div>
                <div className="flex items-center">
                    {/* GO TO FIRST PAGE */}
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={currentPage <= 1}
                    >
                        <Link href={generatePageUrl(currentPage - 1)}>
                            <span className="sr-only">Go to first page</span>
                            <DoubleArrowLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    {/* GO TO PREV PAGE */}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={currentPage <= 1}
                    >
                        <Link href={generatePageUrl(currentPage - 1)}>
                            <span className="sr-only">Go to previous page</span>
                            <ChevronLeftIcon className="h-4 w-4" />
                        </Link>
                    </Button>

                    <div className="md:hidden flex w-[100px] items-center justify-center text-sm font-medium">
                        Page {currentPage} of {totalPages}
                    </div>
                    {/* GO TO NEXT PAGE */}
                    <Button
                        variant="outline"
                        className="h-8 w-8 p-0"
                        disabled={currentPage >= totalPages}
                    >
                        <Link href={generatePageUrl(currentPage + 1)}>
                            <span className="sr-only">Go to next page</span>
                            <ChevronRightIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                    {/* GO TO LAST PAGE */}
                    <Button
                        variant="outline"
                        className="hidden h-8 w-8 p-0 lg:flex"
                        disabled={currentPage >= totalPages}
                    >
                        <Link href={generatePageUrl(currentPage + 1)}>
                            <span className="sr-only">Go to last page</span>
                            <DoubleArrowRightIcon className="h-4 w-4" />
                        </Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
