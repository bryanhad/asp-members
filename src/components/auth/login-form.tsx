'use client'

import { CardWrapper } from './card-wrapper'
import * as z from 'zod'
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
import { Button } from '../ui/button'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'
import { loginAction } from '@/actions/login'
import { useState, useTransition } from 'react'
import Link from 'next/link'
import { LoginSchema } from '@/schemas'
import LoadingButton from '../loading-button'

export const LoginForm = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()
    console.log(success)

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    })

    function onSubmit(values: z.infer<typeof LoginSchema>) {
        setError('')
        setSuccess('')

        startTransition(async () => {
            try {
                const data = await loginAction(values)

                if (data?.error) {
                    form.reset()
                    setError(data.error)
                }
                if (data?.success) {
                    form.reset()
                    setSuccess(data.success)
                }
                // if (data?.twoFactor) {
                //     setShowTwoFactor(true)
                // }
            } catch (err) {
                setError('Something went wrong!')
            }
        })
    }

    return (
        <CardWrapper
            headerLabel="Welcome back"
            backButtonLabel="Don't have an account?"
            backButtonHref="/auth/register"
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
                                    <Button
                                        asChild
                                        size="sm"
                                        variant="link"
                                        className="px-0 font-normal"
                                    >
                                        <Link href="/auth/reset">
                                            Forgot password?
                                        </Link>
                                    </Button>
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
                        Login
                    </LoadingButton>
                </form>
            </Form>
        </CardWrapper>
    )
}
