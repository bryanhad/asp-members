'use client'

import { useRouter } from 'next/navigation'
import {
    Dialog,
    DialogContent,
    DialogTrigger
} from '@/components/ui/dialog'
import { LoginForm } from './login-form'

type LoginButtonProps = {
    children: React.ReactNode
    mode?: 'modal' | 'redirect'
    asChild?: boolean
}

export default function LoginButton({
    children,
    asChild,
    mode = 'redirect',
}: LoginButtonProps) {
    const router = useRouter()

    function onClick() {
        router.push('/auth/login')
    }

    if (mode === 'modal') {
        return (
            <Dialog>
            <DialogTrigger asChild={asChild}>
                {children}
            </DialogTrigger>
            <DialogContent className='p-0 w-auto bg-transparent border-none'>
                <LoginForm/>
            </DialogContent>
        </Dialog>
        )
    }

    return <span onClick={onClick}>{children}</span>
}
