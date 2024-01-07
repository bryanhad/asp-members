'use client'

import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { useDebouncedCallback } from 'use-debounce'
import { Input } from '../ui/input'

export default function DataTableSearch({
    placeholder,
}: {
    placeholder: string
}) {
    const searchParams = useSearchParams()
    const pathname = usePathname()
    const { replace } = useRouter()

    const handleSearch = useDebouncedCallback((term: string) => {
        const params = new URLSearchParams(searchParams)
        params.set('page', '1')
        if (term) {
            params.set('q', term)
        } else {
            params.delete('q')
        }
        replace(`${pathname}?${params.toString()}`)
    }, 300)

    return (
        <Input
            placeholder={placeholder}
            defaultValue={searchParams.get('q')?.toString()}
            onChange={(e) => {
                handleSearch(e.target.value)
            }}
            className="max-w-sm"
        />
    )
}
