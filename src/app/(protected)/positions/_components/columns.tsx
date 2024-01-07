'use client'

import { ColumnDef } from '@tanstack/react-table'
import { ArrowUpDown, MoreHorizontal } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { DataTableColumnHeader } from '@/components/table/data-table-column-header'
import { Position } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'
import DeleteButtonModal from '@/components/delete-button-modal'
import { deleteMember } from '@/actions/member'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
type FetchedPosition = {
    _count: {
        members: number
    }
} & Position

export const columns: ColumnDef<FetchedPosition>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Position" />
        ),
    },
    {
        accessorKey: 'count',
        header: 'Member Count',
        cell: ({ row }) => {
            const position = row.original //get the full row data

            return <div>{position._count.members}</div>
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const member = row.original //get the full row data

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
                                navigator.clipboard.writeText(member.id)
                            }
                        >
                            <Link
                                href={`/members/${member.id}`}
                                className="w-full"
                            >
                                <p>View</p>
                            </Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem>
                            <Link
                                href={`/members/${member.id}/edit`}
                                className="w-full"
                            >
                                <p>Edit</p>
                            </Link>
                        </DropdownMenuItem>
                        <DeleteButtonModal
                            onConfirm={() => deleteMember(member.id)}
                            description={`Member '${member.name}' will be deleted permanently.`}
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
