'use client'

import { deleteUser } from '@/actions/admin'
import DeleteButtonModal from '@/components/delete-button-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { dateToString } from '@/lib/utils'
import { User } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

export type FetchedUser = User & {
    _count: {
        blogs: number
    }
}

export const columns: ColumnDef<FetchedUser>[] = [
    {
        accessorKey: 'user',
        header: 'User',
        cell: ({ row }) => {
            const user = row.original //get the full row data

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={user.profilePic || ''} />
                        <AvatarFallback className="bg-secondary">
                            <FaUser className="text-muted-foreground/30" />
                        </AvatarFallback>
                    </Avatar>
                    <p>{user.name}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'email',
        header: 'Email',
    },
    // TODO : ROLE COLUMN
    {
        accessorKey: 'blogs-count',
        header: 'Blogs Written',
        cell: ({ row }) => {
            const user = row.original //get the full row data

            return <div>{user._count.blogs}</div>
        },
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className="text-right">Joined Since</div>,
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as Date 

            return (
                <div className="text-right font-medium">
                    {date ? (
                        dateToString(date)
                    ) : (
                        <span className="italic text-muted-foreground/60">
                            unknown
                        </span>
                    )}
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const user = row.original //get the full row data

            return (
                <DropdownMenu modal={false}>
                    <DropdownMenuTrigger asChild className="min-w-0">
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="text-end">
                        {/* <DropdownMenuLabel>Actions</DropdownMenuLabel> */}
                        <DropdownMenuItem
                            onClick={() =>
                                navigator.clipboard.writeText(user.id)
                            }
                        >
                            <Link href={`/users/${user.id}`} className="w-full">
                                <p>View</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`/users/${user.id}/edit`}
                                className="w-full"
                            >
                                <p>Edit</p>
                            </Link>
                        </DropdownMenuItem>
                        <DeleteButtonModal
                            onConfirm={() => deleteUser(user.id)}
                            description={`User '${user.name}' will be deleted permanently.`}
                        >
                            <p className="w-full text-destructive font-semibold cursor-pointer p-1 rounded-md hover:bg-secondary duration-200">
                                delete
                            </p>
                        </DeleteButtonModal>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
