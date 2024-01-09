import { type ClassValue, clsx } from 'clsx'
import { ReadonlyURLSearchParams } from 'next/navigation'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function generatePagination(currentPage: number, totalPages: number) {
    // If the total number of pages is 4 or less,
    // display all pages without any ellipsis.
    if (totalPages <= 3) {
        return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    // If the current page is among the first 3 pages,
    // show the first 3, an ellipsis, and the last 2 pages.
    if (currentPage <= 2) {
        return [1, 2, 3, '...', totalPages - 1, totalPages]
    }

    // If the current page is among the last 3 pages,
    // show the first 2, an ellipsis, and the last 3 pages.
    if (currentPage >= totalPages - 1) {
        return [1, 2, '...', totalPages - 2, totalPages - 1, totalPages]
    }

    // If the current page is somewhere in the middle,
    // show the first page, an ellipsis, the current page and its neighbors,
    // another ellipsis, and the last page.
    return [
        1,
        '...',
        currentPage - 1,
        currentPage,
        currentPage + 1,
        '...',
        totalPages,
    ]
}

export const getCloudinaryPublicImageId = (url: string) => {
    const splitArr = url.split('/')
    const publicImageId = splitArr[splitArr.length - 1].split('.')[0]
    return publicImageId
}

export const createPageURL = (
    pathname: string,
    searchParams: ReadonlyURLSearchParams,
    pageNumber: number | string,
    pageSize?: number | string,
    order?: string
) => {
    const params = new URLSearchParams(searchParams)
    params.set('page', pageNumber.toString())
    if (pageSize) {
        params.set('size', pageSize.toString())
    }
    if (order) {
        params.set('order', order)
    }
    return `${pathname}?${params.toString()}`
}
