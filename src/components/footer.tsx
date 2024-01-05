import Link from 'next/link'
import { Logo } from './logo'
import { Button } from './ui/button'

export const Footer = () => {
    return (
        <div className="w-full p-6 bg-background z-50">
            <div className="max-w-[1540px] w-full mx-auto flex items-center ">
                <Link href="/dashboard">
                    <Logo className="hidden md:flex" />
                </Link>
                <div className="md:ml-auto flex-[1] justify-between md:justify-end flex items-center gap-x-2 text-muted-foreground">
                    <Button variant="ghost" size="sm">
                        Privacy Policy
                    </Button>
                    <Button variant="ghost" size="sm">
                        Terms & Conditions
                    </Button>
                </div>
            </div>
        </div>
    )
}
