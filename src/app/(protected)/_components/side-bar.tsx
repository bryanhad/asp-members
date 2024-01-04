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
            ],
        },
        {
            name: 'User',
            nestedLinks: [{ name: 'Profile', href: '/settings' }],
        },
    ]
    return (
        <div
            className={cn(
                'absolute left-0 top-0 h-full lg:flex w-[250px] p-6 flex-col gap-4 bg-background hidden border-r-border border-r'
            )}
        >
            {links.map((link) => (
                <div key={link.name} className="flex flex-col">
                    <Button
                        size="sm"
                        variant="looksOnly"
                        className="justify-start font-semibold"
                    >
                        {link.name}
                    </Button>
                    {link.nestedLinks.map((item) => (
                        <Button
                            key={item.name}
                            variant="link"
                            size="sm"
                            className={cn("justify-start ml-2", {'font-normal text-foreground': pathname === item.href})}
                            asChild
                        >
                            <Link href={item.href}>{item.name}</Link>
                        </Button>
                    ))}
                </div>
            ))}
        </div>
    )
}
