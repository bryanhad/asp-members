'use client'

import * as DialogPrimitive from '@radix-ui/react-dialog'
import { CgClose } from 'react-icons/cg'
import * as React from 'react'

import { cn } from '@/lib/utils'
import { DialogOverlay } from '@/components/ui/dialog'

const DialogPortal = DialogPrimitive.Portal

const BurgerMenuContent = React.forwardRef<
    React.ElementRef<typeof DialogPrimitive.Content>,
    React.ComponentPropsWithoutRef<typeof DialogPrimitive.Content>
>(({ className, children, ...props }, ref) => (
    <DialogPortal>
        <DialogOverlay className="xl:hidden" />
        <DialogPrimitive.Content
            ref={ref}
            className={cn(
                'fixed right-0 top-0 z-50 grid w-[75%] max-w-[400px] h-screen gap-4 border bg-background p-6 shadow-lg duration-500 data-[state=open]:duration-300 data-[state=close]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right xl:hidden',
                className
            )}
            {...props}
        >
            {children}
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
                <CgClose className="h-4 w-4" />
                <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        </DialogPrimitive.Content>
    </DialogPortal>
))
BurgerMenuContent.displayName = DialogPrimitive.Content.displayName

export default BurgerMenuContent
