'use client'

import { AddBlogSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Position, Practice } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import BlogForm from '../_components/form'
import { addBlog } from '@/actions/blog'

type AddBlogFormProps = {
    categories: Practice[]
}

export default function AddBlogForm({
    categories,
}: AddBlogFormProps) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof AddBlogSchema>>({
        resolver: zodResolver(AddBlogSchema),
        defaultValues: {
            title: '',
            content: '',
            picture: undefined,
            categorySlug: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof AddBlogSchema>) => {
        startTransition(async () => {
            const formData = new FormData()

            Object.entries(values).forEach(([key, value]) => {
                let input: File | string
                if (value !== undefined) {
                    if (key === 'picture' && values.picture) {
                        input = values.picture[0]
                    } else {
                        input =
                            typeof value === 'string'
                                ? value
                                : JSON.stringify(value)
                    }
                    formData.append(key, input)
                }
            })

            const { error, success } = await addBlog(formData)

            if (success) {
                toast.success(success)
                router.push('/blogs')
            }
            if (error) {
                toast.error(error)
            }
        })
    }

    return (
        <BlogForm
            form={{ ...form }}
            onSubmit={onSubmit}
            loading={isPending}
            categories={categories}
            buttonText="Add Blog"
        />
    )
}
