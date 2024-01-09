'use client'

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogTrigger,
} from '@/components/ui/dialog'
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { Button } from './ui/button'
import { Poppins } from 'next/font/google'
import { cn } from '@/lib/utils'
import LoadingButton from './loading-button'
import { useEffect, useState, useTransition } from 'react'
import { toast } from 'sonner'

type ActionReturn =
    | {
          error: string
          success?: undefined
      }
    | {
          success?: string
          error?: undefined
      }

type RelationActionReturn =
    | {
          error: string
          success: undefined
          prismaError: undefined
      }
    | {
          success: string
          error: undefined
          prismaError: undefined
      }
    | {
          prismaError: {
              title: string
              description: string
              canProceed: boolean
          }
          success: undefined
          error: undefined
      }

type DeleteButtonProps = {
    description: string
    onConfirm: () => Promise<RelationActionReturn>
    onProceed?: () => Promise<RelationActionReturn>
    children: React.ReactNode
}
const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
})

export default function DeleteButtonModal({
    description,
    onConfirm,
    onProceed,
    children,
}: DeleteButtonProps) {
    const [title, setTitle] = useState('Are You Sure?')
    const [desc, setDesc] = useState(description)
    const [open, setOpen] = useState(false)
    const [prismaError, setPrismaError] = useState(false)

    const [isPending, startTransition] = useTransition()

    async function onClick() {
        startTransition(async () => {
            if (prismaError && onProceed) {
                const { error, success } = await onProceed()
                if (error) {
                    toast.error(error)
                    setOpen(false)
                }
                if (success) {
                    toast.success(success)
                    setOpen(false)
                }
            } else {
                const { error, prismaError, success } = await onConfirm()
                if (error) {
                    toast.error(error)
                    setOpen(false)
                }
                if (success) {
                    toast.success(success)
                    setOpen(false)
                }
                if (prismaError) {
                    setTitle(prismaError.title)
                    setDesc(prismaError.description)
                    setPrismaError(true)
                }
            }
        })
    }
    useEffect(() => {
        if (!open) {
            setOpen(false)
            setTitle('Are You Sure?')
            setDesc(description)
        }
    }, [open, description])

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                {children}
            </DialogTrigger>
            <DialogContent className="p-0 w-auto bg-transparent border-none">
                <Card className=" shadow-md">
                    <CardHeader>
                        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
                            <h1
                                className={cn(
                                    'text-3xl font-semibold',
                                    font.className
                                )}
                            >
                                {title}
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {desc}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <LoadingButton
                            isLoading={isPending}
                            className="w-[70%]"
                            onClick={onClick}
                            variant="destructive"
                        >
                            {prismaError ? 'PROCEED' : 'YES'}
                        </LoadingButton>
                    </CardContent>
                    <CardFooter>
                        <DialogClose asChild>
                            <Button
                                variant={'link'}
                                className="font-normal w-full"
                                size={'sm'}
                            >
                                cancel
                            </Button>
                        </DialogClose>
                    </CardFooter>
                </Card>
            </DialogContent>
        </Dialog>
    )
}
