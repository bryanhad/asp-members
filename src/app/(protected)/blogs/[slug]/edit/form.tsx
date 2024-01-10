'use client'

import { editBlog } from '@/actions/blog'
import { EditBlogSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Blog, Practice } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import BlogForm from '../../_components/form'

type EditBlogFormProps = {
    categories: Practice[]
    blog: Blog
}

export default function EditBlogForm({ categories, blog }: EditBlogFormProps) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditBlogSchema>>({
        resolver: zodResolver(EditBlogSchema),
        defaultValues: {
            title: blog.title,
            content: blog.content,
            picture: undefined,
            categorySlug: blog.categorySlug,
        },
    })

    const onSubmit = async (values: z.infer<typeof EditBlogSchema>) => {
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
            const titleFieldIsDirty = form.formState.dirtyFields.title
            const { error, success } = await editBlog(
                formData,
                blog.id,
                titleFieldIsDirty
            )

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
            blogPicture={blog.picture}
            form={{ ...form }}
            onSubmit={onSubmit}
            loading={isPending}
            categories={categories}
            buttonText="Edit Blog"
        />
    )
}
