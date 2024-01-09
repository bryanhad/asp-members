'use client'

import { deletePractice } from '@/actions/practices'
import DeleteButtonModal from '@/components/delete-button-modal'
import { Button } from '@/components/ui/button'
import { PiPencilSimpleLine } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { FiTrash } from 'react-icons/fi'
import Link from 'next/link'
import Image from 'next/image'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Practice } from '@prisma/client'
import { FaImage } from 'react-icons/fa'

type PracticeTableCellProps = {
    practice: {
        _count: {
            members: number
        }
    } & Practice
}

export default function PracticeTableCell({
    practice,
}: PracticeTableCellProps) {
    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-center sm:h-[65px] justify-between p-2 sm:px-6 rounded-md border-border border-[1px] sm:gap-4'
            )}
        >
            <div className="flex items-center gap-2 flex-[1]">
                <div className="flex-[1]">
                    <div className="flex items-center gap-2">
                        <Avatar className="h-8 w-8 rounded-sm">
                            <AvatarImage src={practice.icon} className='bg-white p-[2px]'/>
                            <AvatarFallback className="bg-secondary">
                                <FaImage className="text-muted-foreground/30" />
                            </AvatarFallback>
                        </Avatar>
                        <p>{practice.name}</p>
                    </div>
                </div>
                <Button asChild variant="ghost" size="sm">
                    <Link href={`/practices/${practice.id}/edit`}>
                        <PiPencilSimpleLine />
                    </Link>
                </Button>
                <DeleteButtonModal
                    onConfirm={() => deletePractice(practice.id)}
                    description={`Practice '${practice.name}' will be deleted permanently.`}
                    onProceed={() => deletePractice(practice.id, true)}
                >
                    <Button
                        variant="ghost"
                        size="sm"
                        className="dark:text-red-600 text-red-500"
                    >
                        <FiTrash />
                    </Button>
                </DeleteButtonModal>
            </div>
            <div className="flex sm:flex-col items-center gap-3 sm:gap-1">
                <p className="text-secondary-foreground/20 text-sm">
                    Member count:
                </p>
                <p>{practice._count.members}</p>
            </div>
        </div>
    )
}
