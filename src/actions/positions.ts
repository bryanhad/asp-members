'use server'
import { getPositionByName } from '@/data/position'
import { db } from '@/lib/db'
import { PositionsSchema } from '@/schemas'
import * as z from 'zod'

export const AddPosition = async (values: z.infer<typeof PositionsSchema>) => {
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

    return { success: `Position '${name}' successfuly added!` }
}
