'use server'
import { getPositionById, getPositionByName } from '@/data/position'
import { db } from '@/lib/db'
import { PositionsSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const addPosition = async (values: z.infer<typeof PositionsSchema>) => {
    const validatedFields = PositionsSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { name } = validatedFields.data

    const positionExists = await getPositionByName(name)
    if (positionExists) {
        return { error: `Position '${name}' already exists!` }
    }

    await db.position.create({
        data: { name },
    })

    revalidatePath('/positions')
    return { success: `Position '${name}' successfuly added!` }
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

    const positionExists = await getPositionByName(name)
    if (positionExists) {
        return { error: `Position '${name}' already exists!` }
    }

    await db.position.update({
        where: { id },
        data: { name },
    })

    revalidatePath('/positions')
    return { success: `Position '${name}' successfuly edited!` }
}

export const deletePosition = async (id: string) => {
    const tobeDeletedPosition = await getPositionById(id)
    if (!tobeDeletedPosition) {
        return { error: `Position doesn't exist!` }
    }

    await db.position.delete({
        where: { id },
    })

    revalidatePath('/positions')
    return {
        success: `Position '${tobeDeletedPosition.name}' successfuly deleted!`,
    }
}
