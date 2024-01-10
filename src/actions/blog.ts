'use server'

import { getBlogByTitle } from '@/data/blog'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { uploadImage } from '@/lib/image-upload'
import { generateSlug } from '@/lib/utils'
import { AddBlogSchemaBackend } from '@/schemas'
import { revalidatePath } from 'next/cache'

export const addBlog = async (formData: FormData) => {
    const user = await currentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = AddBlogSchemaBackend.safeParse({
        picture: formData.get('picture') as File,
        title: formData.get('title'),
        content: formData.get('content'),
        categorySlug: formData.get('categorySlug'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: `Invalid fields!` }
    }

    try {
        const existingBlog = await getBlogByTitle(validatedFields.data.title)
        if (existingBlog) {
            return { error: `Blog's title must be unique!` }
        }

        const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { secure_url } = await uploadImage(buffer, 'blog/thumbnail')

        const slug = generateSlug(validatedFields.data.title)

        const newBlog = await db.blog.create({
            data: {
                ...validatedFields.data,
                picture: secure_url,
                slug,
                authorId: user.id,
            },
        })

        revalidatePath('/blogs')
        return {
            success: `Successfully added '${validatedFields.data.title}'!`,
        }
    } catch (err) {
        console.log(err)
        return { error: `Something went wrong!` }
    }
}
