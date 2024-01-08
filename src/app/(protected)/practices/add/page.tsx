'use client'

import { PracticesSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import dynamic from 'next/dynamic'
import { useMemo, useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { Input } from '@/components/ui/input'
import { addPractice } from '@/actions/practices'
import LoadingButton from '@/components/loading-button'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
export default function AddPracticesPage() {
    const router = useRouter()
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')
    
    const [isPending, startTransition] = useTransition()
    
    //dynamic import so that blocknote editor would be imported on the client side!
    const TextEditor = useMemo(
        () =>
            dynamic(() => import('../_components/text-editor'), { ssr: false }),
        []
    )

    const form = useForm<z.infer<typeof PracticesSchema>>({
        resolver: zodResolver(PracticesSchema),
        defaultValues: {
            name: '',
            content: '',
        },
    })

    function onSubmit(values: z.infer<typeof PracticesSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            const data = await addPractice(values)

            if (data.success) {
                router.push('/practices')
                toast.success(data.success)
            }
            if (data.error) {
                toast.error(data.error)
            }
        })
    }

    return (
        <div>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder="Hukum Rimba"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Description</FormLabel>
                                    <FormControl>
                                        <TextEditor onChange={field.onChange} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <LoadingButton isLoading={isPending}>SUBMIT</LoadingButton>
                </form>
            </Form>
        </div>
    )
}
