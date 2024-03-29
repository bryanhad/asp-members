'use client'

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
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type PracticeFormProps = {
    form: any
    onSubmit: (values: any) => Promise<void>
    loading: boolean
    buttonText: string
    iconUrl?: string
    pictureUrl?: string
}

export const PracticeForm = ({
    onSubmit,
    buttonText,
    form,
    loading,
    iconUrl,
    pictureUrl
}: PracticeFormProps) => {
    const [iconFileUrl, setIconFileUrl] = useState<string | undefined>(undefined)
    const [pictureProfileUrl, setPictureProfileUrl] = useState<string | undefined>(undefined)

    //dynamic import so that blocknote editor would be imported on the client side!
    const TextEditor = useMemo(
        () => dynamic(() => import('@/components/text-editor'), { ssr: false }),
        []
    )

    return (
        <div>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>

                        {/* ICON */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border bg-white">
                                <Image
                                    className="object-cover p-2"
                                    alt=""
                                    src={iconFileUrl || iconUrl || '/noimage.png'}
                                    fill
                                    priority
                                />
                            </div>
                            <FormField
                                control={form.control}
                                name="icon"
                                render={({ field: { onChange }, ...field }) => (
                                    <FormItem className="flex flex-col items-center sm:items-start">
                                        <FormLabel>Icon</FormLabel>
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
                                                        setIconFileUrl(url)
                                                    } else {
                                                        if (iconFileUrl) {
                                                            URL.revokeObjectURL(
                                                                iconFileUrl
                                                            )
                                                        }
                                                        setIconFileUrl(undefined)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* ICON END */}
                        {/* PICTURE */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border bg-primary/50">
                                <Image
                                    className="object-cover"
                                    alt=""
                                    src={pictureProfileUrl || pictureUrl || '/noimage.png'}
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
                                                        setPictureProfileUrl(url)
                                                    } else {
                                                        if (pictureProfileUrl) {
                                                            URL.revokeObjectURL(
                                                                pictureProfileUrl
                                                            )
                                                        }
                                                        setPictureProfileUrl(undefined)
                                                    }
                                                }}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        {/* PICTURE END */}
                        </div>

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
                                            placeholder="Hukum Rimba"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Description</FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            uploadImageFolderLocation='practice/content'
                                            onChange={field.onChange}
                                            initialContent={form.watch(
                                                'content'
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <LoadingButton isLoading={loading}>
                        {buttonText}
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}
