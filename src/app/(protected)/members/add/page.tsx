import { getAllPositions } from '@/data/position'
import React from 'react'
import AddMemberForm from './_components/form'

export default async function AddMemberPage() {
    const positions = await getAllPositions()
    if (!positions) throw Error('bruh')
    return (
        <div>
            <AddMemberForm positions={positions} />
        </div>
    )
}
