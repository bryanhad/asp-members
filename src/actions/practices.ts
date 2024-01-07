'use server'
import {
    getPracticeByIdWithMemberCount,
    getPracticeByName
} from '@/data/practice'
import { db } from '@/lib/db'
import { PracticesSchema } from '@/schemas'
import { revalidatePath } from 'next/cache'
import * as z from 'zod'

export const addPractice = async (values: z.infer<typeof PracticesSchema>) => {
    const validatedFields = PracticesSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { name } = validatedFields.data

    const practiceExists = await getPracticeByName(name)
    if (practiceExists) {
        return { error: `Practice '${name}' already exists!` }
    }

    await db.practice.create({
        data: { name },
    })

    revalidatePath('/practices')
    return { success: `Practice '${name}' successfuly added!` }
}

export const deletePractice = async (id: string, proceed = false) => {
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

    try {
        await db.practice.delete({
            where: { id },
        })
    } catch (err) {
        return { error: `An unknown error occurred.` }
    }

    revalidatePath('/practices')
    return {
        success: `Practice '${tobeDeletedPractice.name}' successfuly deleted!`,
    }
}
