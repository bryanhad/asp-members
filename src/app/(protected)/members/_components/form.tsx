'use client'

import { AddMemberSchema, EditMemberSchema } from '@/schemas'
import MultiInput from '@/components/forms/multi-input'
import LoadingButton from '@/components/loading-button'
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
import { Textarea } from '@/components/ui/textarea'
import { Member, Position, Practice } from '@prisma/client'
import Image from 'next/image'
import { useState } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'
import MultiSelectInput from '@/components/forms/multi-select-input'

type MemberFormProps = {
    member?: Member
    positions: Position[]
    practices: Practice[]
    form: UseFormReturn<
        z.infer<typeof EditMemberSchema | typeof AddMemberSchema>
    >
    onSubmit: (values: any) => Promise<void>
    loading: boolean
}

export default function MemberForm({
    positions,
    member,
    form,
    onSubmit,
    loading,
    practices,
}: MemberFormProps) {
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    const onSubmitForm = async (values: any) => {
        onSubmit(values)
    }

    return (
        <div className="">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmitForm)}
                >
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                        {/* IMAGE UPLOAD */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border">
                                <Image
                                    className="object-cover"
                                    alt=""
                                    src={
                                        fileUrl ||
                                        member?.picture ||
                                        '/noavatar.png'
                                    }
                                    fill
                                    priority
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="picture"
                                render={({ field: { onChange }, ...field }) => (
                                    <FormItem className="flex flex-col items-center sm:items-start">
                                        <FormLabel>Picture</FormLabel>
                                        {/* File Upload */}
                                        <FormControl>
                                            <Input
                                                disabled={loading}
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
                        <div className="grid grid-cols-1 gap-5">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                disabled={loading}
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
                                                disabled={loading}
                                                placeholder="Bambang@example.com"
                                                type="email"
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="positionId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Position</FormLabel>
                                    <Select
                                        disabled={loading}
                                        onValueChange={field.onChange}
                                        defaultValue={field.value}
                                    >
                                        <FormControl>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a position" />
                                            </SelectTrigger>
                                        </FormControl>
                                        <SelectContent className="max-h-[200px]">
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
                                            disabled={loading}
                                            placeholder="About this member.."
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="education"
                            render={({ field }) => (
                                <MultiInput
                                    currentValue={form.watch('education')}
                                    setValue={(input) =>
                                        form.setValue('education', input)
                                    }
                                    disabled={loading}
                                    {...field}
                                />
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="organization"
                            render={({ field }) => (
                                <MultiInput
                                    currentValue={form.watch('organization')}
                                    setValue={(input) =>
                                        form.setValue('organization', input)
                                    }
                                    disabled={loading}
                                    {...field}
                                />
                            )}
                        />

                        <FormField
                            control={form.control}
                            name="practices"
                            render={({ field }) => (
                                <MultiSelectInput
                                    items={practices}
                                    disabled={loading}
                                    currentValue={form.watch('practices')}
                                    name="Practices"
                                    setValue={(input) =>
                                        form.setValue('practices', input)
                                    }
                                />
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
                                                disabled={loading}
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
                    <LoadingButton isLoading={loading} type="submit">
                        Upload Image
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}
