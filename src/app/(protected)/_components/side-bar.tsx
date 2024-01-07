'use client'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export default function SideBar() {
    const pathname = usePathname()

    const links = [
        {
            name: 'Test',
            nestedLinks: [
                { name: 'Dashboard', href: '/dashboard' },
                { name: 'Settings', href: '/settings' },
                { name: 'Server', href: '/server' },
                { name: 'Client', href: '/client' },
                { name: 'Admin', href: '/admin' },
            ],
        },
        {
            name: 'General',
            nestedLinks: [
                { name: 'Users', href: '/users' },
                { name: 'Members', href: '/members' },
                { name: 'Blogs', href: '/blogs' },
                { name: 'Positions', href: '/positions' },
                { name: 'Practices', href: '/practices' },
            ],
        },
        {
            name: 'User',
            nestedLinks: [{ name: 'Profile', href: '/settings' }],
        },
    ]
    return (
        <aside
            className={cn(
                'absolute left-0 top-0 h-full lg:flex w-[250px] p-6 flex-col gap-4 bg-background hidden border-r-border border-r'
            )}
        >
            {links.map((link) => (
                <div key={link.name} className="flex flex-col">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight">
                        {link.name}
                    </h2>
                    <div className="space-y-1">
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
