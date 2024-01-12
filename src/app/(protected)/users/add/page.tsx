import React from 'react'
import { AddUserForm } from './form'
import { currentRole } from '@/lib/auth'

export default async function AddUserPage() {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }
    return (
        <div>
            <AddUserForm />
        </div>
    )
}
