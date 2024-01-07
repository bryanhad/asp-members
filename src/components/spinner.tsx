import { RiLoader4Line } from 'react-icons/ri'

import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const spinnerVariants = cva('text-muted-foreground/80 animate-spin', {
    variants: {
        size: {
            default: 'h-4 w-4',
            sm: 'h-2 w-2',
            lg: 'h-6 w-6',
            xl: 'h-20 w-20',
            icon: 'h-10 w-10',
        },
    },
    defaultVariants: {
        size: 'default',
    },
})

interface SpinnerProps extends VariantProps<typeof spinnerVariants> {}

export const Spinner = ({ size }: SpinnerProps) => {
    return <RiLoader4Line className={cn(spinnerVariants({ size }))} />
}
