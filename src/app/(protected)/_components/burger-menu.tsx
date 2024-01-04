import { Button } from '@/components/ui/button'
import {
    Dialog,
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import BurgerMenuContent from './burger-menu-content'
import { RiMenu4Line } from 'react-icons/ri'
import Link from 'next/link'

export function BurgerMenu() {
    const links = [
        { name: 'Dashboard', href: '/dashboard' },
        { name: 'Settings', href: '/settings' },
        { name: 'Server', href: '/server' },
        { name: 'Client', href: '/client' },
        { name: 'Admin', href: '/admin' },
    ]

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden">
                    <RiMenu4Line />
                </Button>
            </DialogTrigger>
            <BurgerMenuContent className="flex flex-col pt-6">
                <div>
                    <h1>Logo</h1>
                    <div className="flex flex-col gap-4 mt-4 pl-6">
                        {links.map((link) => (
                            <DialogClose asChild key={link.name}>
                                <Link href={link.href} className="">
                                    {link.name}
                                </Link>
                            </DialogClose>
                        ))}
                    </div>
                </div>
                {/* <DialogHeader>
                    <DialogTitle>Share link</DialogTitle>
                    <DialogDescription>
                        Anyone who has this link will be able to view this.
                    </DialogDescription>
                </DialogHeader>
                <div className="flex items-center space-x-2">
                    <div className="grid flex-1 gap-2">
                        <Label htmlFor="link" className="sr-only">
                            Link
                        </Label>
                        <Input
                            id="link"
                            defaultValue="https://ui.shadcn.com/docs/installation"
                            readOnly
                        />
                    </div>
                    <Button type="submit" size="sm" className="px-3">
                        <span className="sr-only">Copy</span>
                        <Copy className="h-4 w-4" />
                    </Button>
                </div> */}
                {/* <DialogFooter className="sm:justify-start">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            Close
                        </Button>
                    </DialogClose>
                </DialogFooter> */}
            </BurgerMenuContent>
        </Dialog>
    )
}
