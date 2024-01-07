'use client'

import { deletePractice } from '@/actions/practices'
import DeleteButtonModal from '@/components/delete-button-modal'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PiPencilSimpleLine } from 'react-icons/pi'
import { cn } from '@/lib/utils'
import { FiTrash } from 'react-icons/fi'

type PracticeTableCellProps = {
    practice: {
        _count: {
            members: number
        }
    } & {
        id: string
        name: string
    }
}

export default function PracticeTableCell({
    practice,
}: PracticeTableCellProps) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-center sm:h-[65px] justify-between p-2 sm:px-6 rounded-md border-border border-[1px] sm:gap-4'
            )}
        >
            {isEditing ? (
                <p>Mestinya ngedit nih</p>
                // <EditingForm
                //     closeForm={() => setIsEditing(false)}
                //     practice={practice}
                // />
            ) : (
                <>
                    <div className="flex items-center gap-2 flex-[1]">
                        <p className="flex-[1]">{practice.name}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <PiPencilSimpleLine />
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
                </>
            )}
        </div>
    )
}
