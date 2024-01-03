'use client'

import { CardWrapper } from './card-wrapper'
import * as z from 'zod'
import { NewPasswordSchema } from '@/schemas'
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
import { Input } from '../ui/input'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { useState, useTransition } from 'react'
import { useSearchParams } from 'next/navigation'
import { newPasswordAction } from '@/actions/new-password'
import LoadingButton from '../loading-button'

export const NewPasswordForm = () => {
    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof NewPasswordSchema>>({
        resolver: zodResolver(NewPasswordSchema),
        defaultValues: {
            password: '',
        },
    })

    function onSubmit(values: z.infer<typeof NewPasswordSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            const data = await newPasswordAction(values, token)

            setError(data?.error)
            setSuccess(data?.success)
        })
    }

    return (
        <CardWrapper
            headerLabel="Enter a new password"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
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
                                            placeholder="*****"
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
                        Reset Password
                    </LoadingButton>
                </form>
            </Form>
        </CardWrapper>
    )
}
