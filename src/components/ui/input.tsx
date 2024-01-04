import { cn } from '@/lib/utils'
import { cva, VariantProps } from 'class-variance-authority'
import React from 'react'

const inputVariants = cva(
    'flex h-10 w-full  border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none  disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'rounded-md focus-visible:ring-2 focus-visible:ring-ring/10 focus-visible:ring-offset-1',
                onlyRoundLeft: 'rounded-l-md',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    }
)

export interface InputProps
    extends React.InputHTMLAttributes<HTMLInputElement>,
        VariantProps<typeof inputVariants> {
    error?: boolean
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant, error, ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    inputVariants({ variant, className }),
                    error && 'border-destructive',
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = 'Input'

export { Input }
