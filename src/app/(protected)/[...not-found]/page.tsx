import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PiRobotLight } from 'react-icons/pi'

export default function NotFoundPage() {
    return (
        <div className="items-center flex text-center text-muted-foreground flex-[1] justify-center">
            <div className="flex flex-col items-center pb-40">
                <PiRobotLight className="text-[150px] " />
                <h1 className="text-[100px] font-bold leading-none">404</h1>
                <div className="flex flex-col items-center gap-4">
                    <p>
                        The page you are looking for may have been moved,
                        deleted, or never existed.
                    </p>
                    <Button asChild>
                        <Link href={'/'}>Return to dashboard</Link>
                    </Button>
                </div>
            </div>
        </div>
    )
}
