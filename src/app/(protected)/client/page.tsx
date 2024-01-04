'use client'

import { UserInfo } from '@/components/user-info'
import { useCurrentUser } from '@/hooks/use-current-user'

export default function ClientPage() {
    const user = useCurrentUser()

    return (
        <div>

        </div>
        // <UserInfo
        //     label="🤳 Client Component"
        //     user={user}
        // />
    )
}
