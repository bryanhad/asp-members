import { getAllPositions } from '@/data/position'
import React from 'react'
import AddMemberForm from './form'
import { AddMemberSchema } from '@/schemas'
import { getAllPractices } from '@/data/practice'

export default async function AddMemberPage() {
    const positions = await getAllPositions()
    const practices = await getAllPractices()

    return (
        <div>
            <AddMemberForm positions={positions} practices={practices}/>
        </div>
    )
}
