import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
    'inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
    {
        variants: {
            variant: {
                looksOnly: 'bg-background text-foreground cursor-default',
                default:
                    'bg-primary text-primary-foreground shadow hover:bg-primary/90',
                destructive:
                    'bg-destructive text-destructive-foreground shadow-sm hover:bg-destructive/90',
                outline:
                    'border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
                secondary:
                    'bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80',
                ghost: 'hover:bg-accent hover:text-accent-foreground',
                link: 'underline-offset-3 hover:underline text-foreground/50 hover:text-foreground/80 duration-300 text-sm',
                'single-line-submit-button':
                    'border-y border-r border-emerald-500 shadow-sm hover:bg-emerald-400 bg-emerald-500 text-white dark:hover:bg-emerald-500 dark:bg-emerald-600',
                'outline-y-only': 'border-y border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground',
            },
            rounded: {
                full: 'rounded-full',
                md: 'rounded-md',
                onlyRightMd: 'rounded-r-md',
                noRounded: '',
            },
            size: {
                default: 'h-9 px-4 py-2',
                xxs: 'h-5 w-5',
                xs: 'h-8 px-3 text-xs',
                sm: 'h-8 px-3 text-sm font-light',
                lg: 'h-10 px-8',
                icon: 'h-9 w-9',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
            rounded: 'md',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
        VariantProps<typeof buttonVariants> {
    asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, rounded, size, asChild = false, ...props }, ref) => {
        const Comp = asChild ? Slot : 'button'
        return (
            <Comp
                className={cn(
                    buttonVariants({ variant, size, rounded, className })
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
