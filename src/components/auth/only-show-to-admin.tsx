'use client'

import { useCurrentUser } from '@/hooks/use-current-user'

type OnlyShowToAdminProps = {
    children: React.ReactNode
    ownerId?: string
}

export const OnlyShowToAdmin = ({
    children,
    ownerId,
}: OnlyShowToAdminProps) => {
    const user = useCurrentUser()

    if (!user) return <p>unauthorized</p>

    if (
        (user.role === 'ADMIN' && user.id !== ownerId)
    ) {
        //if the current user's role is not the same as the assigned allowedRole that is passed to this component
        return <>{children}</>
    }

    return null
}
