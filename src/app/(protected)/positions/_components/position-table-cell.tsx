'use client'

import SingleLineInput from '@/components/forms/single-line-input'
import { Button } from '@/components/ui/button'
import { useState } from 'react'
import { PiPencilSimpleLine } from 'react-icons/pi'
import EditingForm from './editing-form'
import DeleteButtonModal from '@/components/delete-button-modal'
import DeleteConfirmationModal from '@/components/delete-confirmation-modal'
import { deletePosition } from '@/actions/positions'

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
        <div className="flex items-center justify-between px-6 py-2 rounded-md bg-secondary gap-4">
            {isEditing ? (
                <EditingForm
                    closeForm={() => setIsEditing(false)}
                    position={position}
                />
            ) : (
                <>
                    <div className="flex items-center gap-2">
                        <p>{position.name}</p>
                        <Button onClick={() => setIsEditing(true)}>
                            <PiPencilSimpleLine />
                        </Button>
                        <DeleteButtonModal
                            onConfirm={() => deletePosition(position.id)}
                            label={`Position '${position.name}' will be deleted permanently.`}
                        />
                    </div>
                    <div className="flex flex-col items-center gap-1">
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
