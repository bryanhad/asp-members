'use server'
import {
    getPositionByIdWithMemberCount,
    getPositionByName,
} from '@/data/position'
import { db } from '@/lib/db'
import { generateSlug } from '@/lib/utils'
import { PositionsSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const addPosition = async (values: z.infer<typeof PositionsSchema>) => {
    const validatedFields = PositionsSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { name } = validatedFields.data

    try {
        const positionExists = await getPositionByName(name)
        if (positionExists) {
            return { error: `Position '${name}' already exists!` }
        }

        const slug = generateSlug(validatedFields.data.name)

        await db.position.create({
            data: { name, slug },
        })

        revalidatePath('/positions')
        return { success: `Position '${name}' successfuly added!` }
    } catch (error) {
        return { error: `Something went wrong!` }
    }
}

export const editPosition = async (
    values: z.infer<typeof PositionsSchema>,
    id: string
) => {
    const validatedFields = PositionsSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { name } = validatedFields.data

    try {
        const positionExists = await getPositionByName(name)
        if (positionExists) {
            return { error: `Position '${name}' already exists!` }
        }

        let slug: string | undefined
        if (validatedFields.data.name) {
            slug = generateSlug(validatedFields.data.name)
        }

        await db.position.update({
            where: { id },
            data: { name, slug },
        })

        revalidatePath('/positions')
        return { success: `Position '${name}' successfuly edited!` }
    } catch (error) {
        return { error: `Something went wrong!` }
    }
}

export const deletePosition = async (id: string, proceed = false) => {
    const tobeDeletedPosition = await getPositionByIdWithMemberCount(id)
    if (!tobeDeletedPosition) {
        return { error: `Position doesn't exist!` }
    }
    if (tobeDeletedPosition._count.members > 0 && !proceed) {
        return {
            prismaError: {
                title: `There are still members that has '${tobeDeletedPosition.name}' position.`,
                description:
                    'Deleting this would also delete all members that has this position.',
                canProceed: true,
            },
        }
    }

    try {
        await db.position.delete({
            where: { id },
        })
    } catch (err) {
        return { error: `An unknown error occurred.` }
    }

    revalidatePath('/positions')
    return {
        success: `Position '${tobeDeletedPosition.name}' successfuly deleted!`,
    }
}
