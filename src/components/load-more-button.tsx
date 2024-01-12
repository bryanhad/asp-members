'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { Button, ButtonProps } from './ui/button'
import { createPageURL } from '@/lib/utils'

type LoadMoreButtonProps = {
    currentPage: number
    totalDataCount: number
    shownItemsCount: number
} & ButtonProps

export const LoadMoreButton = ({
    currentPage,
    totalDataCount,
    shownItemsCount,
    ...props
}: LoadMoreButtonProps) => {
    const router = useRouter()
    const pathname = usePathname()
    const searchParams = useSearchParams()

    if (shownItemsCount >= totalDataCount) {
        return (
            <Button {...props} disabled>
                Nothing more to load.
            </Button>
        )
    }

    function onClick() {
        router.push(createPageURL(pathname, searchParams, currentPage + 1))
    }

    return (
        <Button {...props} onClick={onClick}>
            Load More
        </Button>
    )
}
