'use client'

import { FiTrash } from 'react-icons/fi'
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
import { useState, useTransition } from 'react'
import { toast } from 'sonner'

type DeleteButtonProps = {
    label: React.ReactNode
    onConfirm: () => Promise<
        | {
              error: string
              success?: undefined
          }
        | {
              success: string
              error?: undefined
          }
    >
}
const font = Poppins({
    subsets: ['latin'],
    weight: ['600'],
})

export default function DeleteButtonModal({
    label,
    onConfirm,
}: DeleteButtonProps) {
    const [open, setOpen] = useState(false)

    const [isPending, startTransition] = useTransition()

    async function onClick() {
        startTransition(async () => {
            const data = await onConfirm()
            if (data.error) {
                toast.error(data.error)
                setOpen(false)
            }
            if (data.success) {
                toast.success(data.success)
                setOpen(false)
            }
        })
        await onConfirm()
        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild onClick={() => setOpen(true)}>
                <Button variant="ghost" size='sm' className='dark:text-red-600 text-red-500'>
                    <FiTrash />
                </Button>
            </DialogTrigger>
            <DialogContent className="p-0 w-auto bg-transparent border-none">
                <Card className="w-[400px] shadow-md">
                    <CardHeader>
                        <div className="w-full flex flex-col gap-y-4 items-center justify-center">
                            <h1
                                className={cn(
                                    'text-3xl font-semibold',
                                    font.className
                                )}
                            >
                                Are You Sure?
                            </h1>
                            <p className="text-muted-foreground text-sm">
                                {label}
                            </p>
                        </div>
                    </CardHeader>
                    <CardContent className="flex justify-center">
                        <DialogClose asChild>
                            <LoadingButton
                                isLoading={isPending}
                                className="w-[70%]"
                                onClick={onClick}
                                variant="destructive"
                            >
                                YES
                            </LoadingButton>
                        </DialogClose>
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
