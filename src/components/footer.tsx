import Link from 'next/link'
import { Logo } from './logo'
import { Button } from './ui/button'

export const Footer = () => {
    return (
        <div className="w-full p-6 bg-background z-50">
            <div className="max-w-[1540px] w-full mx-auto flex items-center justify-center md:justify-between">
                <Link href="/">
                    <Logo className="hidden md:flex" />
                </Link>
                <p className="font-light text-sm text-muted-foreground">
                    &copy; 2024 AspLawfirm | All Rights Reserved
                </p>
            </div>
        </div>
    )
}
