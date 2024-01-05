'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BurgerMenu } from './burger-menu'
import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { useScrollTop } from '@/hooks/use-scroll-top'
import { cn } from '@/lib/utils'
import { Logo } from '@/components/logo'

export const Navbar = () => {
    const scrolled = useScrollTop()

    return (
        <nav
            className={cn(
                'fixed top-0 left-0 w-full bg-background z-50 duration-300 border-b-transparent',
                scrolled && 'border-b-border border-b shadow-sm'
            )}
        >
            <div className="max-w-[1540px] mx-auto h-[60px] flex justify-between px-7  items-center">
                <Link href="/dashboard">
                    <Logo />
                </Link>

                <div className="flex gap-4 items-center">
                    <BurgerMenu />
                    <ThemeToggleButton />
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}
