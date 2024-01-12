'use client'

import { profileAction } from '@/actions/profile'
import { FormError } from '@/components/form-error'
import { FormSuccess } from '@/components/form-success'
import LoadingButton from '@/components/loading-button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { useCurrentUser } from '@/hooks/use-current-user'
import { SettingsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { UserRole } from '@prisma/client'
import { useSession } from 'next-auth/react'
import Image from 'next/image'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import * as z from 'zod'

export default function SettingsPage() {
    const user = useCurrentUser()

    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const { update } = useSession()
    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof SettingsSchema>>({
        resolver: zodResolver(SettingsSchema),
        defaultValues: {
            name: user?.name || undefined, //don't put empty string, cuz then the profileAction prisma would get the name's field value of empty string and would update the record in the db to that empty string
            //if it is undefined, pirsma wouldn't even add the name field to the update part.. which is what we want right?
            email: user?.email || undefined,
            password: undefined,
            newPassword: undefined,
            role: user?.role || undefined,
            profilePic: undefined,
        },
    })

    const onSubmit = (values: z.infer<typeof SettingsSchema>) => {
        setError('')
        setSuccess('')

        startTransition(async () => {
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                let input: File | string
                if (value !== undefined) {
                    if (key === 'profilePic' && values.profilePic) {
                        input = values.profilePic[0]
                    } else {
                        input =
                            typeof value === 'string'
                                ? value
                                : JSON.stringify(value)
                    }
                    formData.append(key, input)
                }
            })

            try {
                const data = await profileAction(formData)

                if (data.error) {
                    setError(data.error)
                }
                if (data.success) {
                    update()
                    setSuccess(data.success)
                    setTimeout(() => {
                        setSuccess('')
                    }, 3000)
                }
            } catch (err) {
                setError('Something went wrong!')
            }
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                {/* <p className="text-2xl font-semibold text-center">⚙ Profile Settings</p> */}
            </CardHeader>
            <CardContent>
                <Form {...form}>
                    <form
                        className="space-y-6"
                        onSubmit={form.handleSubmit(onSubmit)}
                    >
                        <div className="space-y-4">
                            {/* IMAGE UPLOAD */}
                            <div className="flex flex-col sm:flex-row gap-4 items-center">
                                <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border">
                                    <Image
                                        className="object-cover"
                                        alt=""
                                        src={
                                            fileUrl ||
                                            user?.profilePic ||
                                            '/noavatar.png'
                                        }
                                        fill
                                        priority
                                    />
                                </div>
                                <FormField
                                    control={form.control}
                                    name="profilePic"
                                    render={({
                                        field: { onChange },
                                        ...field
                                    }) => (
                                        <FormItem className="flex flex-col items-center sm:items-start">
                                            <FormLabel>
                                                Profile Picture
                                            </FormLabel>
                                            {/* File Upload */}
                                            <FormControl>
                                                <Input
                                                    disabled={isPending}
                                                    type="file"
                                                    accept="image/*"
                                                    {...field}
                                                    onChange={(event) => {
                                                        const files =
                                                            event.target.files

                                                        if (!files) return

                                                        // Triggered when user uploaded a new file
                                                        // FileList is immutable, so we need to create a new one
                                                        const dataTransfer =
                                                            new DataTransfer()

                                                        // Add newly uploaded images
                                                        Array.from(
                                                            files
                                                        ).forEach((image) =>
                                                            dataTransfer.items.add(
                                                                image
                                                            )
                                                        )

                                                        // Validate and update uploaded file
                                                        const newFiles =
                                                            dataTransfer.files
                                                        onChange(newFiles)
                                                        if (files[0]) {
                                                            const url =
                                                                URL.createObjectURL(
                                                                    files[0]
                                                                )
                                                            setFileUrl(url)
                                                        } else {
                                                            if (fileUrl) {
                                                                URL.revokeObjectURL(
                                                                    fileUrl
                                                                )
                                                            }
                                                            setFileUrl(
                                                                undefined
                                                            )
                                                        }
                                                    }}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                            {/* Image upload end */}
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
                            {/* <FormField
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
                            /> */}
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
