'use client'

import { CardWrapper } from './card-wrapper'
import * as z from 'zod'
import { ResetPasswordSchema } from '@/schemas'
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
import { resetPasswordAction } from '@/actions/reset-password'
import { useState, useTransition } from 'react'
import LoadingButton from '../loading-button'

export const ResetPasswordForm = () => {
    const [error, setError] = useState<string | undefined>('')
    const [success, setSuccess] = useState<string | undefined>('')

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof ResetPasswordSchema>>({
        resolver: zodResolver(ResetPasswordSchema),
        defaultValues: {
            email: '',
        },
    })

    function onSubmit(values: z.infer<typeof ResetPasswordSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            try {
                const data = await resetPasswordAction(values)

                setError(data?.error)
                setSuccess(data?.success)
            } catch (err) {
                setError('Something went wrong!')
            }
        })
    }

    return (
        <CardWrapper
            headerLabel="Forgot your password?"
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
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>
                                        Enter your account&apos;s email
                                    </FormLabel>
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
                    </div>
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <LoadingButton
                        isLoading={isPending}
                        type="submit"
                        className="w-full"
                    >
                        Send reset password email
                    </LoadingButton>
                </form>
            </Form>
        </CardWrapper>
    )
}
