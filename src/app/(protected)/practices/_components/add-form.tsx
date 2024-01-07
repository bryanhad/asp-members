'use client'

import { addPractice } from '@/actions/practices'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import { SingleLineInput } from '@/components/forms/single-line-input'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { PracticesSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export default function AddForm() {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const form = useForm<z.infer<typeof PracticesSchema>>({
        resolver: zodResolver(PracticesSchema),
        defaultValues: {
            name: '',
        },
    })

    const [isPending, startTransition] = useTransition()

    async function onSubmit(values: z.infer<typeof PracticesSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            const data = await addPractice(values)

            if (data.error) {
                setError(data.error)
            }
            if (data.success) {
                setSuccess(data.success)
                form.reset()
            }
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
                                <FormLabel>Add new practice</FormLabel>
                                <FormControl>
                                    <SingleLineInput
                                        buttonText="Add Practice"
                                        placeholder="Hukum Rimba"
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
