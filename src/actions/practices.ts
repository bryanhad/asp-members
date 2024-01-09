'use server'
import {
    getPracticeById,
    getPracticeByIdWithMemberCount,
    getPracticeByName,
} from '@/data/practice'
import { db } from '@/lib/db'
import { updateImage, uploadImage } from '@/lib/image-upload'
import { getCloudinaryPublicImageId } from '@/lib/utils'
import {
    AddPracticeSchemaBackend,
    EditMemberSchema,
    EditPracticeSchema,
    EditPracticeSchemaBackend,
} from '@/schemas'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const addPractice = async (formData: FormData) => {
    const validatedFields = AddPracticeSchemaBackend.safeParse({
        icon: formData.get('icon') as File,
        name: formData.get('name'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid fields!' }
    }

    const { name, content, icon } = validatedFields.data

    try {
        const practiceExists = await getPracticeByName(name)
        if (practiceExists) {
            return { error: `Practice '${name}' already exists!` }
        }

        const arrayBuffer = await icon.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)
        const { secure_url } = await uploadImage(buffer, 'practice')

        await db.practice.create({
            data: { name, content, icon: secure_url },
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
        name: formData.get('name'),
        content: formData.get('content'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid fields!' }
    }

    const { name, content, icon } = validatedFields.data

    try {
        const existingPractice = await getPracticeById(id)

        let iconUrl: string | undefined

        if (icon) {
            const arrayBuffer = await icon.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const publicImageId = getCloudinaryPublicImageId(
                existingPractice.icon
            )
            const { secure_url } = await updateImage(
                buffer,
                'practice',
                publicImageId
            )
            iconUrl = secure_url
        }

        const practiceExists = await getPracticeByName(name)
        if (practiceExists && nameFieldIsDirty)
            return { error: `Practice '${name}' already exists!` }

        await db.practice.update({
            where: { id },
            data: { name, content, icon: iconUrl },
        })

        revalidatePath('/practices')
        return { success: `Practice '${name}' successfuly edited!` }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}

export const deletePractice = async (id: string, proceed = false) => {
    try {
        const tobeDeletedPractice = await getPracticeByIdWithMemberCount(id)
        if (!tobeDeletedPractice) {
            return { error: `Practice doesn't exist!` }
        }
        if (tobeDeletedPractice._count.members > 0 && !proceed) {
            return {
                prismaError: {
                    title: `There are still members that has '${tobeDeletedPractice.name}' practice.`,
                    description:
                        'Deleting this would also delete all members that has this practice.',
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
        return { error: `An unknown error occurred.` }
    }
}
