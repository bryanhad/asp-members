'use client'

import { useCurrentRole } from '@/hooks/use-current-role'
import { UserRole } from '@prisma/client'
import { FormError } from '../form-error'

type RoleGateProps = {
    children: React.ReactNode
    allowedRole: UserRole
}

export default function RoleGate({ allowedRole, children }: RoleGateProps) {
    const role = useCurrentRole()

    if (role !== allowedRole) {
        //if the current user's role is not the same as the assigned allowedRole that is passed to this component
        return (
            <FormError message="You do not have permission to view this content" />
        )
    }

    return <>{children}</>
}
