'use client'

import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

type PageTitleProps = {
    className?: string
}

export default function PageTitle({ className }: PageTitleProps) {
    const pathname = usePathname()

    const pathnameArr = pathname.split('/')

    const isAddPage = pathnameArr[2] === 'add'
    const isEditPage = pathnameArr[3] === 'edit'

    const singularPageTitle = pathnameArr[1].slice(0, -1)

    let title: string

    switch (true) {
        case isAddPage:
            title = `Add ${singularPageTitle}`
            break
        case isEditPage:
            title = `Edit ${singularPageTitle}`
            break
        default:
            title = pathnameArr[1] || 'Dashboard'
            break
    }

    return (
        <h1
            className={cn(
                'font-bold text-2xl sm:text-3xl max-sm:text-center md:text-4xl capitalize',
                className
            )}
        >
            {title}
        </h1>
    )
}
