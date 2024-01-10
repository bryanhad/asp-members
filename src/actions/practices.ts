'use server'
import {
    getPracticeById,
    getPracticeByIdWithMemberCountAndBlogCount,
    getPracticeByName,
} from '@/data/practice'
import { db } from '@/lib/db'
import { updateImage, uploadImage } from '@/lib/image-upload'
import { generateSlug, getCloudinaryPublicImageId } from '@/lib/utils'
import { AddPracticeSchemaBackend, EditPracticeSchemaBackend } from '@/schemas'
import { revalidatePath } from 'next/cache'

export const addPractice = async (formData: FormData) => {
    const validatedFields = AddPracticeSchemaBackend.safeParse({
        icon: formData.get('icon') as File,
        picture: formData.get('picture') as File,
        name: formData.get('name'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid fields!' }
    }

    const { name, content, icon, picture } = validatedFields.data

    try {
        const practiceExists = await getPracticeByName(name)
        if (practiceExists) {
            return { error: `Practice '${name}' already exists!` }
        }

        const [iconArrayBuffer, pictureArrayBuffer] = await Promise.all([
            icon.arrayBuffer(),
            picture.arrayBuffer(),
        ])
        const iconBuffer = new Uint8Array(iconArrayBuffer)
        const pictureBuffer = new Uint8Array(pictureArrayBuffer)

        const [{ secure_url: iconUrl }, { secure_url: pictureUrl }] =
            await Promise.all([
                uploadImage(iconBuffer, 'practice/icon'),
                uploadImage(pictureBuffer, 'practice/picture'),
            ])

        const slug = generateSlug(validatedFields.data.name)

        await db.practice.create({
            data: { name, content, icon: iconUrl, picture: pictureUrl, slug },
        })

        revalidatePath('/practices')
        return { success: `Practice '${name}' successfuly added!` }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}

export const editPractice = async (
    formData: FormData,
    id: string,
    nameFieldIsDirty: boolean | undefined
) => {
    const validatedFields = EditPracticeSchemaBackend.safeParse({
        icon: (formData.get('icon') as File | null) || undefined,
        picture: (formData.get('picture') as File | null) || undefined,
        name: formData.get('name'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid fields!' }
    }

    const { name, content, icon, picture } = validatedFields.data

    try {
        const practiceExists = await getPracticeByName(name)
        if (practiceExists && nameFieldIsDirty)
            return { error: `Practice '${name}' already exists!` }

        const existingPractice = await getPracticeById(id)

        // HANDLE EDIT ICON

        let iconUrl: string | undefined

        if (icon) {
            const arrayBuffer = await icon.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const publicImageId = getCloudinaryPublicImageId(
                existingPractice.icon
            )
            const { secure_url } = await updateImage(
                buffer,
                'practice/icon',
                publicImageId
            )
            iconUrl = secure_url
        }

        // HANDLE EDIT PICTURE

        let pictureUrl: string | undefined

        if (picture) {
            const arrayBuffer = await picture.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const publicImageId = getCloudinaryPublicImageId(
                existingPractice.picture
            )
            const { secure_url } = await updateImage(
                buffer,
                'practice/picture',
                publicImageId
            )
            pictureUrl = secure_url
        }

        let slug: string | undefined
        if (validatedFields.data.name) {
            slug = generateSlug(validatedFields.data.name)
        }

        await db.practice.update({
            where: { id },
            data: { name, content, icon: iconUrl, slug, picture: pictureUrl },
        })

        revalidatePath('/practices')
        return { success: `Practice '${name}' successfuly edited!` }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}

export const deletePractice = async (id: string, proceed = false) => {
    try {
        const tobeDeletedPractice = await getPracticeByIdWithMemberCountAndBlogCount(id)
        if (!tobeDeletedPractice) {
            return { error: `Practice doesn't exist!` }
        }
        if (tobeDeletedPractice._count.members > 0 && !proceed) {
            return {
                prismaError: {
                    title: `There are still members that has '${tobeDeletedPractice.name}' practice.`,
                    description:
                        'Deleting this practice would also delete all members that has this practice.',
                    canProceed: true,
                },
            }
        }
        if (tobeDeletedPractice._count.blogs > 0 && !proceed) {
            return {
                prismaError: {
                    title: `There are still blog(s) that uses '${tobeDeletedPractice.name}' as it's category.`,
                    description:
                        `Deleting this practice would also delete all blogs that have this practice as their category.`,
                    canProceed: true,
                },
            }
        }
        await db.practice.delete({
            where: { id },
        })

        revalidatePath('/practices')
        return {
            success: `Practice '${tobeDeletedPractice.name}' successfuly deleted!`,
        }
    } catch (err) {
        console.log(err)
        return { error: `An unknown error occurred.` }
    }
}
