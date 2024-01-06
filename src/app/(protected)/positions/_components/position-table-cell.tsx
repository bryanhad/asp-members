'use client'

import { deletePosition } from '@/actions/positions'
import DeleteButtonModal from '@/components/delete-button-modal'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PiPencilSimpleLine } from 'react-icons/pi'
import EditingForm from './editing-form'
import { cn } from '@/lib/utils'
import { FiTrash } from 'react-icons/fi'

type PositionTableCellProps = {
    position: {
        _count: {
            members: number
        }
    } & {
        id: string
        name: string
    }
}

export default function PositionTableCell({
    position,
}: PositionTableCellProps) {
    const [isEditing, setIsEditing] = useState(false)

    return (
        <div
            className={cn(
                'flex flex-col sm:flex-row items-center sm:h-[65px] justify-between p-2 sm:px-6 rounded-md border-border border-[1px] sm:gap-4'
            )}
        >
            {isEditing ? (
                <EditingForm
                    closeForm={() => setIsEditing(false)}
                    position={position}
                />
            ) : (
                <>
                    <div className="flex items-center gap-2 flex-[1]">
                        <p className="flex-[1]">{position.name}</p>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setIsEditing(true)}
                        >
                            <PiPencilSimpleLine />
                        </Button>
                        <DeleteButtonModal
                            onConfirm={() => deletePosition(position.id)}
                            label={`Position '${position.name}' will be deleted permanently.`}
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
                        <p>{position._count.members}</p>
                    </div>
                </>
            )}
        </div>
    )
}
