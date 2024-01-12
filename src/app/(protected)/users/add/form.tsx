'use client'

import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'

import { registerAction } from '@/actions/register'
import { useState, useTransition } from 'react'
import { Input } from '@/components/ui/input'
import LoadingButton from '@/components/loading-button'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'


export const AddUserForm = () => {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof RegisterSchema>>({
        resolver: zodResolver(RegisterSchema),
        defaultValues: {
            email: '',
            password: '',
            name: '',
        },
    })

    function onSubmit(values: z.infer<typeof RegisterSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            try {
                const data = await registerAction(values)

                setError(data.error)
                setSuccess(data.success)
            } catch (err) {
                setError('Something went wrong!')
            }
        })
    }

  return (
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
                                placeholder="John Doe"
                                type="text"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="Bruh@example.com"
                                type="email"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                            <Input
                                {...field}
                                disabled={isPending}
                                placeholder="******"
                                type="password"
                            />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
        </div>
        <FormError message={error} />
        <FormSuccess message={success} />
        <LoadingButton
            isLoading={isPending}
            type="submit"
            className="w-full"
        >
            Create an user
        </LoadingButton>
    </form>
</Form>
  )
}
