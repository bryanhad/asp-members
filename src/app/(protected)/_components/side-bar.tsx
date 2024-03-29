'use client'

import { Button } from '@/components/ui/button'
import { NAV_LINKS } from '@/constants'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideBar() {
    const pathname = usePathname()

    return (
        <aside
            className={cn(
                'absolute left-0 top-0 h-full lg:flex w-[250px] p-6 flex-col gap-4 bg-background hidden border-r-border border-r'
            )}
        >
            {NAV_LINKS.map((link) => (
                <div key={link.name} className="flex flex-col">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        {link.name}
                    </h2>
                    <div className="ml-4 space-y-1">
                        {link.nestedLinks.map((item) => (
                            <Button
                                key={item.name}
                                variant={
                                    pathname === item.href
                                        ? 'secondary'
                                        : 'ghost'
                                }
                                size="sm"
                                className={cn(' w-full justify-start', {
                                    'font-normal text-foreground':
                                        pathname === item.href,
                                })}
                                asChild
                            >
                                <Link href={item.href}>{item.name}</Link>
                            </Button>
                        ))}
                    </div>
                </div>
            ))}
        </aside>
    )
}
