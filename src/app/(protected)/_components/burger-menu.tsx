'use client'

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
import { cn } from '@/lib/utils'
import { usePathname } from 'next/navigation'

export function BurgerMenu() {
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
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="xl:hidden">
                    <RiMenu4Line />
                </Button>
            </DialogTrigger>
            <BurgerMenuContent className="flex flex-col pt-6">
                <div >
                    <DialogClose asChild className='flex-[1]'>
                        <Link href='/dashboard' className='p-2'>Logo</Link>
                    </DialogClose>

                    <div className="flex flex-col gap-4 mt-4 pr-5">
                        {links.map((link) => (
                            <div key={link.name} className="flex flex-col">
                                <Button
                                    size="sm"
                                    variant="looksOnly"
                                    className="justify-end font-semibold"
                                >
                                    {link.name}
                                </Button>
                                {link.nestedLinks.map((item) => (
                                    <DialogClose asChild key={link.name}>
                                        <Button
                                            key={item.name}
                                            variant="link"
                                            size="sm"
                                            className={cn('justify-end mr-2', {
                                                'font-normal text-foreground':
                                                    pathname === item.href,
                                            })}
                                            asChild
                                        >
                                            <Link href={item.href}>
                                                {item.name}
                                            </Link>
                                        </Button>
                                    </DialogClose>
                                ))}
                            </div>
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
