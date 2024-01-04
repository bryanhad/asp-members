'use client'

import { addPosition } from '@/actions/positions'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { PositionsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import SingleLineInput from '@/components/forms/single-line-input'

export default function AddForm() {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const form = useForm<z.infer<typeof PositionsSchema>>({
        resolver: zodResolver(PositionsSchema),
        defaultValues: {
            name: '',
        },
    })

    const [isPending, startTransition] = useTransition()

    async function onSubmit(values: z.infer<typeof PositionsSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            const data = await addPosition(values)

            setError(data?.error)
            setSuccess(data?.success)
            setTimeout(() => {
                setSuccess('')
            }, 3000)
        })
    }

    return (
        <Form {...form}>
            <form className="space-y-6" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Add new position</FormLabel>
                                <FormControl>
                                    <SingleLineInput
                                        buttonText="Add Position"
                                        placeholder="Obe"
                                        isLoading={isPending}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormError message={error} />
                <FormSuccess message={success} />
            </form>
        </Form>
    )
}
