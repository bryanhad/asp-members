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
import { Member, Position } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'
import Link from 'next/link'

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

type FetchedMember = Member & { position: Position }

export const columns: ColumnDef<FetchedMember>[] = [
    {
        accessorKey: 'name',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Member" />
        ),
        cell: ({ row }) => {
            const member = row.original //get the full row data

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={member.picture} />
                        <AvatarFallback className="bg-secondary">
                            <FaUser className="text-muted-foreground/30" />
                        </AvatarFallback>
                    </Avatar>
                    <p>{member.name}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'email',
        header: ({ column }) => (
            <DataTableColumnHeader column={column} title="Email" />
        ),
    },
    {
        accessorKey: 'positionId',
        header: 'Position',
        cell: ({ row }) => {
            const member = row.original //get the full row data

            return <div>{member.position.name}</div>
        },
    },
    {
        accessorKey: 'amount',
        header: () => <div className="text-right">Amount</div>,
        cell: ({ row }) => {
            const amount = parseFloat(row.getValue('amount'))
            const formatted = new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: 'USD',
            }).format(amount)

            return <div className="text-right font-medium">{formatted}</div>
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
                            <p className="w-full">Edit</p>
                        </DropdownMenuItem>
                        <DropdownMenuItem>
                            <p className="w-full">Delete</p>
                        </DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
