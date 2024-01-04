'use client'

import { UserButton } from '@/components/auth/user-button'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { BurgerMenu } from './burger-menu'

export const Navbar = () => {
    return (
        <nav className="fixed top-0 left-0 w-full bg-white z-50">
            <div className="max-w-[1540px] mx-auto h-[50px] flex justify-between px-7  items-center">
                <h1>LOGO</h1>
                <BurgerMenu />
            </div>
            {/* <UserButton /> */}
        </nav>
    )
}
