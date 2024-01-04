import { cn } from '@/lib/utils'

type OuterContainerProps = {
    children: React.ReactNode
    className?: string
}

export default function OuterContainer({
    className,
    children,
}: OuterContainerProps) {
    return (
        <div
            className={cn(
                'w-full max-w-[1400px] px-4 mx-auto flex-[1] lg:pl-[250px]',
                className
            )}
        >
            {children}
        </div>
    )
}
