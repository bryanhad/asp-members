'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BurgerMenu } from './burger-menu'
import { ThemeToggleButton } from '@/components/theme-toggle-button'

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-background z-50 border-b-border border-b">
            <div className="max-w-[1540px] mx-auto h-[50px] flex justify-between px-7  items-center">
                <h1>LOGO</h1>
                <div className="flex gap-4 items-center">
                    <BurgerMenu />
                    <ThemeToggleButton />
                    <UserButton />
                </div>
            </div>
        </nav>
    )
}
