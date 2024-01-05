'use client'

import { addMember } from '@/actions/member'
import { Button } from '@/components/ui/button'
import { AddMemberSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
// import { CldUploadButton } from 'next-cloudinary'
// import { CldImage } from 'next-cloudinary'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
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
import LoadingButton from '@/components/loading-button'
import { Input } from '@/components/ui/input'
import Image from 'next/image'
import { Textarea } from '@/components/ui/textarea'
import { Position } from '@prisma/client'
import { toast } from 'sonner'
import { useRouter } from 'next/navigation'
// import { DatePickerDemo } from '@/components/date-picker'

type AddMemberFormProps = {
    positions: Position[]
}

type AddMemberResponse = {
    error: string;
    success?: undefined;
} | {
    success: string;
    error?: undefined;
}

export default function AddMemberForm({ positions }: AddMemberFormProps) {
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof AddMemberSchema>>({
        resolver: zodResolver(AddMemberSchema),
        defaultValues: {
            name: '',
            email: '',
            picture: undefined,
            description: '',
            positionId: '',
            education: [],
            organization: [],
            practices: [],
            // joinedSince: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof AddMemberSchema>) => {
        const rawValues = {
            ...values,
            picture: values.picture[0],
            education: JSON.stringify(values.education),
            organization: JSON.stringify(values.organization),
            practices: JSON.stringify(values.practices),
            // joinedSince: JSON.stringify(values.joinedSince),
        }
        startTransition(async () => {
            try {
                const formData = new FormData()

                Object.entries(rawValues).forEach(([key, value]) => {
                    formData.append(key, value)
                })

                const data = await fetch('/api/admin/add-member', {
                    method: 'POST',
                    body: formData,
                })
                const res:AddMemberResponse = await data.json()

                if (res.success) {
                    toast.success(res.success)
                    router.push('/members')
                } 
                if (res.error) {
                    toast.error(res.error)
                }
            } catch (err) {
                console.log(err)
            }
        })
    }

    return (
        <div className="flex  gap-4 items-center">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                    // action={addMember}
                >
                    <div className="space-y-4">
                        {/* IMAGE UPLOAD */}
                        <div className="flex gap-4 items-center">
                            <div className="rounded-lg overflow-hidden relative w-32 h-32 border">
                                <Image
                                    className="object-cover"
                                    alt=""
                                    src={fileUrl || '/noavatar.png'}
                                    fill
                                    priority
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="picture"
                                render={({ field: { onChange }, ...field }) => (
                                    <FormItem>
                                        <FormLabel>Picture</FormLabel>
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
                                                    Array.from(files).forEach(
                                                        (image) =>
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
                                                        setFileUrl(undefined)
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
                                            disabled={isPending}
                                            placeholder="Bambang "
                                            type="name"
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
                                            placeholder="Bambang@example.com"
                                            type="email"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="positionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <Select
                                        disabled={isPending}
                                        onValueChange={field.onChange}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a position" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {positions.map((position) => (
                                                <SelectItem
                                                    key={position.id}
                                                    value={position.id}
                                                >
                                                    {position.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>About Member</FormLabel>
                                    <FormControl>
                                        <Textarea
                                            {...field}
                                            disabled={isPending}
                                            placeholder="About this member.."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        {/* <FormField
                            control={form.control}
                            name="joinedSince"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Joined Since</FormLabel>
                                    <FormControl>
                                        <>
                                            <Input
                                                {...field}
                                                disabled={isPending}
                                                className="hidden"
                                            />
                                            <DatePickerDemo
                                                onDateSelect={field.onChange}
                                            />
                                        </>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        /> */}
                    </div>
                    <LoadingButton isLoading={isPending} type="submit">
                        Upload Image
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}
