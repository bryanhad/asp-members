'use client'

import { deleteMember } from '@/actions/member'
import DeleteButtonModal from '@/components/delete-button-modal'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Member, Position } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { FaUser } from 'react-icons/fa'

export type FetchedMember = Member & { position: Position }

export const columns: ColumnDef<FetchedMember>[] = [
    {
        accessorKey: 'member',
        header: 'Member',
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
        header: 'Email',
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