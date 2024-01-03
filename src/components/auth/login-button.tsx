'use client'

import { useRouter } from 'next/navigation'

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
        return <div>This should be a modal</div>
    }

    return <span onClick={onClick}>{children}</span>
}
