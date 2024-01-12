'use client'

import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PiRobotLight } from 'react-icons/pi'

type errorPageProps = {
    error: Error & { digest?: string }
    reset: () => void
}

export default function ErrorPage({ error, reset }: errorPageProps) {
    return (
        <div className="items-center flex text-center text-muted-foreground flex-[1] justify-center">
            <div className="flex flex-col items-center pb-40">
                <PiRobotLight className="text-[150px] " />
                <h1 className="text-[100px] font-bold leading-none">Oops!</h1>
                <div className="flex flex-col items-center gap-4 mt-4">
                    <p>{error.message || "It seems you have encountered some unknown error."}</p>
                    <Button asChild>
                        <Link href={'/'}>Return to dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
