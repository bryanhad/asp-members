'use client'

import { addMember } from '@/actions/member'
import { Button } from '@/components/ui/button'
import { uploadImageSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
// import { CldUploadButton } from 'next-cloudinary'
// import { CldImage } from 'next-cloudinary'
import { useState, useTransition } from 'react'
import { useForm } from 'react-hook-form'
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

type UploadResult = {
    info: {
        public_id: string
    }
    event: 'success'
}

export default function AddMemberPage() {
    const [imageId, setImageId] = useState('')

    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | undefined>(undefined)
    const [success, setSuccess] = useState<string | undefined>(undefined)
    const [fileUrl, setFileUrl] = useState<string | undefined>(undefined)

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof uploadImageSchema>>({
        resolver: zodResolver(uploadImageSchema),
        defaultValues: {
            picture: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof uploadImageSchema>) => {
        setLoading(true)
        const data = { picture: values.picture[0] }
        try {
            const formData = new FormData()

            Object.entries(data).forEach(([key, value]) => {
                if (key === 'picture') formData.append(key, value)
            })

            console.log('fetch')
            const bruh = await fetch('/api/admin/add-member', {
                method: 'POST',
                body: formData,
            })
            const breh = await bruh.json()
            console.log(breh)
        } catch (err) {
            console.log(err)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            {fileUrl && (
                <div className="rounded-lg overflow-hidden relative w-32 h-32">
                    <Image
                        className="object-cover"
                        alt=""
                        src={fileUrl}
                        fill
                        priority
                    />
                </div>
            )}
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                    // action={addMember}
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="picture"
                            render={({ field: { onChange }, ...field}) => (
                                <FormItem>
                                    <FormLabel>Picture</FormLabel>
                                    {/* File Upload */}
                                    <FormControl>
                                        <Input
                                            type="file"
                                            accept="image/*"
                                            {...field}
                                            onChange={(event) => {
                                                const files = event.target.files

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
                    <FormError message={error} />
                    <FormSuccess message={success} />
                    <LoadingButton isLoading={loading} type="submit">
                        Upload Image
                    </LoadingButton>
                </form>
            </Form>
            {/* <CldUploadButton
                onUpload={(result: any) => {
                    const publicId = result.info.public_id
                    console.log(publicId)
                    setImageId(publicId)
                }}
                uploadPreset="waejtmdz"

                >
                    <Button>
                        Upload Image
                    </Button>
                </CldUploadButton>
            {imageId && (
                <CldImage
                    width="400"
                    height="300"
                    src={imageId}
                    sizes="100vw"
                    alt="Description of my image"
                />
            )} */}
        </div>
    )
}
