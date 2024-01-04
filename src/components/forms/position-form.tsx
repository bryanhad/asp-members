'use client'

import { PositionsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { useState, useTransition } from 'react'
import { Input } from '../ui/input'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import LoadingButton from '../loading-button'
import { AddPosition } from '@/actions/positions'
import SingleLineInput from './single-line-input'

export default function PositionForm() {
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
            const data = await AddPosition(values)

            setError(data?.error)
            setSuccess(data?.success)
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
