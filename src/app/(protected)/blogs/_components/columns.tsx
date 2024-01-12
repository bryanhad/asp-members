'use client'

import { deleteBlog } from '@/actions/blog'
import DeleteButtonModal from '@/components/delete-button-modal'
import { OnlyShowToOwner } from '@/components/only-show-to-owner'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { dateToString } from '@/lib/utils'
import { Blog, Practice, User } from '@prisma/client'
import { ColumnDef } from '@tanstack/react-table'
import { MoreHorizontal } from 'lucide-react'
import Link from 'next/link'
import { FaImage, FaUser } from 'react-icons/fa'

export type FetchedBlog = Blog & {
    author: Pick<User, 'name' | 'profilePic' | 'id'>
} & { category: Pick<Practice, 'name' | 'id'> }

export const columns: ColumnDef<FetchedBlog>[] = [
    {
        accessorKey: 'blog',
        header: 'Blog',
        cell: ({ row }) => {
            const blog = row.original //get the full row data

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 rounded-md">
                        <AvatarImage src={blog.picture} />
                        <AvatarFallback className="bg-secondary rounded-md">
                            <FaImage className="text-muted-foreground/30" />
                        </AvatarFallback>
                    </Avatar>
                    <p>{blog.title}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'category',
        header: 'Category',
        cell: ({ row }) => {
            const category = row.getValue('category') as Pick<
                Practice,
                'name' | 'id'
            >

            return <p>{category.name}</p>
        },
    },
    {
        accessorKey: 'author',
        header: 'Author',
        cell: ({ row }) => {
            const blog = row.original //get the full row data

            return (
                <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8">
                        <AvatarImage src={blog.author.profilePic || ''} />
                        <AvatarFallback className="bg-secondary">
                            <FaUser className="text-muted-foreground/30" />
                        </AvatarFallback>
                    </Avatar>
                    <p>{blog.author.name}</p>
                </div>
            )
        },
    },
    {
        accessorKey: 'createdAt',
        header: () => <div className="text-right">Created At</div>,
        cell: ({ row }) => {
            const date = row.getValue('createdAt') as Date

            return (
                <div className="text-right font-medium">
                    {dateToString(date, 'long')}
                </div>
            )
        },
    },
    {
        id: 'actions',
        cell: ({ row }) => {
            const blog = row.original //get the full row data

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
                        <DropdownMenuItem>
                            <Link
                                href={`/blogs/${blog.slug}/edit`}
                                className="w-full"
                            >
                                <p>Edit</p>
                            </Link>
                        </DropdownMenuItem>
                        <OnlyShowToOwner ownerId={blog.authorId}>
                            <DeleteButtonModal
                                onConfirm={() => deleteBlog(blog.id)}
                                description={`Blog '${blog.title}' will be deleted permanently.`}
                            >
                                <p className="w-full text-destructive font-semibold cursor-pointer p-1 rounded-md hover:bg-secondary duration-200">
                                    delete
                                </p>
                            </DeleteButtonModal>
                        </OnlyShowToOwner>
                    </DropdownMenuContent>
                </DropdownMenu>
            )
        },
    },
]
