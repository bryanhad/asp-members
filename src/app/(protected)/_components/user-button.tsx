'use client'

import { useCurrentUser } from '@/hooks/use-current-user'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { AvatarImage } from '@radix-ui/react-avatar'
import { FaUser } from 'react-icons/fa'
import { LuChevronsLeftRight } from 'react-icons/lu'
import { LogoutButton } from '@/components/auth/logout-button'
import Link from 'next/link'
import { IoSettingsOutline } from 'react-icons/io5'

export const UserButtonn = () => {
    const user = useCurrentUser()

    return (
        <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild className="max-w-max">
                <div
                    role="button"
                    className="flex items-center text-sm p-3 w-full hover:bg-primary/5"
                >
                    <div className="flex gap-2 items-center">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.profilePic || ''} />
                            <AvatarFallback className="bg-sky-500">
                                <FaUser className="text-white" />
                            </AvatarFallback>
                        </Avatar>
                        {/* <span className="text-start font-medium line-clamp-1">
                            {user?.name}
                        </span> */}
                    </div>
                    <LuChevronsLeftRight className="rotate-90 ml-2 text-muted-foreground h-4 w-4" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                className="w-[250px]"
                align="end"
                alignOffset={11}
                forceMount
            >
                <div className="flex flex-col items-end gap-4 py-2 px-4">
                    <p className="text-xs font-medium leading-none text-muted-foreground">
                        {user?.email}
                    </p>
                    <DropdownMenuItem asChild className='cursor-pointer'>
                        <Link
                            href={'/settings'}
                            className="py-1 px-2 hover:bg-secondary duration-300 rounded-sm"
                        >
                            <div className="flex items-center gap-2">
                                <div className="rounded-md bg-secondary p-1">
                                    <Avatar className="h-8 w-8">
                                        <AvatarImage
                                            src={user?.profilePic || ''}
                                        />
                                        <AvatarFallback className="bg-sky-500">
                                            <FaUser className="text-white" />
                                        </AvatarFallback>
                                    </Avatar>
                                </div>
                                <div className="space-y-1 items-center flex gap-2">
                                    <p className="text-sm line-clamp-1">
                                        {user?.name}
                                    </p>
                                    <div>
                                        <IoSettingsOutline className="opacity-50 mb-[2px]" />
                                    </div>
                                </div>
                            </div>
                        </Link>
                    </DropdownMenuItem>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild className="cursor-pointer">
                    <LogoutButton className="w-full text-muted-foreground ">
                        <p className="ml-auto">Log out</p>
                    </LogoutButton>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
