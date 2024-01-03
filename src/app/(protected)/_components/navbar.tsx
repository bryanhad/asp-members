'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export const Navbar = () => {
    const pathname = usePathname()

    const links = [
        { name: 'Settings', href: '/settings' },
        { name: 'Server', href: '/server' },
        { name: 'Client', href: '/client' },
        { name: 'Admin', href: '/admin' },
    ]

    return (
        <nav className="bg-secondary flex justify-between items-center p-4 rounded-xl w-[600px] shadow-sm">
            <div className="flex gap-x-2">
                {links.map((link) => (
                    <Button
                        asChild
                        key={link.name}
                        variant={pathname === link.href ? 'default' : 'outline'}
                    >
                        <Link href={link.href}>{link.name}</Link>
                    </Button>
                ))}
            </div>
            <UserButton />
        </nav>
    )
}
