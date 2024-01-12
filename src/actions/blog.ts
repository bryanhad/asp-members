'use server'

import { getBlogById, getBlogByTitle } from '@/data/blog'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { deleteImage, updateImage, uploadImage } from '@/lib/image-upload'
import { generateSlug, getCloudinaryPublicImageId } from '@/lib/utils'
import {
    AddBlogSchemaBackend,
    EditBlogSchemaBackend,
    EditMemberSchemaBackend,
} from '@/schemas'
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

export const editBlog = async (
    formData: FormData,
    id: string,
    nameFieldIsDirty: boolean | undefined
) => {
    const user = await currentUser()
    if (!user) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = EditBlogSchemaBackend.safeParse({
        picture: (formData.get('picture') as File | null) || undefined,
        title: formData.get('title'),
        content: formData.get('content'),
        categorySlug: formData.get('categorySlug'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid Fields!' }
    }

    const { title, content, categorySlug } = validatedFields.data

    try {
        const blogExists = await getBlogByTitle(title)
        if (blogExists && nameFieldIsDirty)
            return { error: `Blog with title '${title}' already exists!` }

        const existingBlog = await getBlogById(id)

        // HANDLE EDIT PICTURE

        let pictureUrl: string | undefined

        if (validatedFields.data.picture) {
            const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const publicImageId = getCloudinaryPublicImageId(
                existingBlog.picture
            )
            const { secure_url } = await updateImage(
                buffer,
                'blog/thumbnail',
                publicImageId
            )
            pictureUrl = secure_url
        }

        let slug: string | undefined
        if (validatedFields.data.title) {
            slug = generateSlug(validatedFields.data.title)
        }

        await db.blog.update({
            where: { id },
            data: { title, content, slug, picture: pictureUrl, categorySlug },
        })

        revalidatePath('/blogs')
        return { success: `Blog '${title}' successfuly edited!` }
    } catch (err) {
        console.log(err)
        return { error: `Something went wrong!` }
    }
}

export const deleteBlog = async (id: string) => {
    const tobeDeletedBlog = await getBlogById(id)
    if (!tobeDeletedBlog) {
        return { error: `Blog doesn't exist!` }
    }

    const publicImageId = getCloudinaryPublicImageId(tobeDeletedBlog.picture)

    if (!id) { //this snippet is only to avoid getting linting errors on delete button modal props lol, 
        // i jsut want to deploy mann
        // just want this to end.. dont judge.
        return {
            prismaError: {
                title: `bruh.`,
                description: 'double bruh',
                canProceed: true,
            },
        }
    }

    try {
        await db.blog.delete({
            where: { id },
        })
        await deleteImage(publicImageId, 'blog/thumbnail')

        revalidatePath('/blogs')
        return {
            success: `Blog '${tobeDeletedBlog.title}' successfuly deleted!`,
        }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}
