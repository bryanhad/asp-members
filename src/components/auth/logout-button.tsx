'use client'

import { logout } from '@/actions/logout'
import { cn } from '@/lib/utils'

type LogoutButtonProps = {
    children?: React.ReactNode
    className?:string
}

export const LogoutButton = ({ children, className }: LogoutButtonProps) => {
    const onClick = () => {
        logout()
    }

    return (
        <span onClick={onClick} className={cn('cursor-pointer', className)}>
            {children}
        </span>
    )
}
