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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { Practice } from '@prisma/client'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import { useMemo, useState } from 'react'

type BlogFormProps = {
    blogPicture?: string
    categories: Practice[]
    form: any
    onSubmit: (values: any) => Promise<void>
    loading: boolean
    buttonText: string
}

export default function BlogForm({
    blogPicture,
    form,
    onSubmit,
    loading,
    categories,
    buttonText,
}: BlogFormProps) {
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    const TextEditor = useMemo(
        () => dynamic(() => import('@/components/text-editor'), { ssr: false }),
        []
    )

    return (
        <div className="">
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                        {/* IMAGE UPLOAD */}
                        <div className="flex flex-col sm:flex-row gap-4 items-center">
                            <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border">
                                <Image
                                    className="object-cover"
                                    alt=""
                                    src={
                                        fileUrl ||
                                        blogPicture ||
                                        '/noimage.png'
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
                                        <FormLabel>Blog Thumbnail</FormLabel>
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
                                name="title"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Title</FormLabel>
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
                                name="categorySlug"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Category</FormLabel>
                                        <Select
                                            disabled={loading}
                                            onValueChange={field.onChange}
                                            defaultValue={field.value}
                                        >
                                            <FormControl>
                                                <SelectTrigger>
                                                    <SelectValue placeholder="Select a category" />
                                                </SelectTrigger>
                                            </FormControl>
                                            <SelectContent className="max-h-[200px]">
                                                {categories.map((category) => (
                                                    <SelectItem
                                                        key={category.slug}
                                                        value={category.slug}
                                                    >
                                                        {category.name}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                        </div>
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Blog Content</FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            uploadImageFolderLocation='blog/content'
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
                    <LoadingButton isLoading={loading} type="submit">
                        {buttonText}
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}
