'use client'

import { ThemeToggleButton } from '@/components/theme-toggle-button'
import { Button } from '@/components/ui/button'
import { Dialog, DialogClose, DialogTrigger } from '@/components/ui/dialog'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { RiMenu4Line } from 'react-icons/ri'
import BurgerMenuContent from './burger-menu-content'
import { UserButton } from './user-button'
import { useState } from 'react'
import { NAV_LINKS } from '@/constants'

export function BurgerMenu() {
    const pathname = usePathname()
    const [open, setOpen] = useState(false)

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="icon" className="lg:hidden">
                    <RiMenu4Line />
                </Button>
            </DialogTrigger>
            <BurgerMenuContent className="flex flex-col pt-12 items-end">
                <UserButton onClick={() => setOpen(false)} />
                <div className="flex flex-col gap-4 mt-4 pr-5">
                    {NAV_LINKS.map((link) => {
                        return (
                            <div key={link.name} className="flex flex-col">
                                <Button
                                    size="sm"
                                    variant="looksOnly"
                                    className="justify-end font-semibold text-muted-foreground"
                                >
                                    {link.name}
                                </Button>
                                {link.nestedLinks.map((item) => (
                                    <DialogClose asChild key={item.name}>
                                        <Button
                                            key={item.name}
                                            variant="link"
                                            size="sm"
                                            className={cn('justify-end', {
                                                'bg-secondary text-foreground':
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
                        )
                    })}
                </div>
                <div className="flex-[1] flex items-end pb-10">
                    <ThemeToggleButton />
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
