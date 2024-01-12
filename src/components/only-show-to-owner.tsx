'use client'

import { useCurrentUser } from '@/hooks/use-current-user'

type OnlyShowToOwnerProps = {
    children: React.ReactNode
    ownerId: string
}

export const OnlyShowToOwner = ({
    children,
    ownerId,
}: OnlyShowToOwnerProps) => {
    const user = useCurrentUser()

    if (!user) return <p>unauthorized</p>

    if (
        user.role === 'ADMIN' ||
        (user.role === 'USER' && user.id === ownerId)
    ) {
        //if the current user's role is not the same as the assigned allowedRole that is passed to this component
        return <>{children}</>
    }

    return null
}
