'use client'

import { settingsAction } from '@/actions/settings'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { useState, useTransition } from 'react'
import { useSession } from 'next-auth/react'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { useForm } from 'react-hook-form'
import { SettingsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Input } from '@/components/ui/input'
import { useCurrentUser } from '@/hooks/use-current-user'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { UserRole } from '@prisma/client'
import LoadingButton from '@/components/loading-button'

export default function SettingsPage() {
    const user = useCurrentUser()

    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const { update } = useSession()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined, //don't put empty string, cuz then the settingsAction prisma would get the name's field value of empty string and would update the record in the db to that empty string
            //if it is undefined, pirsma wouldn't even add the name field to the update part.. which is what we want right?
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
        },
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        setError('')
        setSuccess('')
        
        startTransition(async () => {
            try {
                const data = await settingsAction(values)

                if (data.error) {
                    setError(data.error)
                }
                if (data.success) {
                    update()
                    setSuccess(data.success)
                }
            } catch (err) {
                setError('Something went wrong!')
            }
        })
    }

    return (
        <Card className="w-[600px]">
            <CardHeader>
                <p className="text-2xl font-semibold text-center">⚙ Settings</p>
            </CardHeader>
            <CardContent>
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
                                                placeholder="John Doe"
                                                disabled={isPending}
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
                                                placeholder="John.doe@gmail.com"
                                                disabled={isPending}
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
                                        <FormLabel>Old Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                disabled={isPending}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="newPassword"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>New Password</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                placeholder="******"
                                                disabled={isPending}
                                                type="password"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <Select
                                            disabled={isPending}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a role" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                <SelectItem
                                                    value={UserRole.ADMIN}
                                                >
                                                    Admin
                                                </SelectItem>
                                                <SelectItem
                                                    value={UserRole.USER}
                                                >
                                                    User
                                                </SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormError message={error} />
                        <FormSuccess message={success} />
                        <LoadingButton isLoading={isPending} type="submit">
                            Save
                        </LoadingButton>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
