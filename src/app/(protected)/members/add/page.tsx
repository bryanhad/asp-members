import { getAllPositions } from '@/data/position'
import React from 'react'
import AddMemberForm from './form'
import { AddMemberSchema } from '@/schemas'

export default async function AddMemberPage() {
    const positions = await getAllPositions()
    if (!positions) throw Error('bruh')
    return (
        <div>
            <AddMemberForm positions={positions} />
        </div>
    )
}
