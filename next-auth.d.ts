import { UserRole } from '@prisma/client'
import { DefaultSession } from 'next-auth'

export type ExtendedUser = Omit<
    DefaultSession['user'] & {
        role: UserRole
        profilePic: string | null
    },
    'image'
>

declare module 'next-auth' {
    interface Session {
        user: ExtendedUser
    }
}
