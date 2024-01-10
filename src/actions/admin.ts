'use server'

import { currentRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const adminAction = async () => {
    const role = await currentRole()

    if (role === UserRole.ADMIN) {
        return { success: 'Allowed server action!' }
    }
    return { error: 'Forbidden server action!' }
}

export const deleteUser = async (id: string, proceed = false) => {
    try {
        const role = await currentRole()

        if (role !== UserRole.ADMIN) {
            return { error: 'Unauthorized!' }
        }
        const toBeDeletedUser = await db.user.findUnique({
            where: { id },
            include: { _count: { select: { blogs: true } } },
        })
        if (!toBeDeletedUser) {
            return { error: 'User Not Found!' }
        }

        if (toBeDeletedUser._count.blogs > 0 && !proceed) {
            return {
                prismaError: {
                    title: `User '${toBeDeletedUser.name}' has created some blogs!`,
                    description: `Deleting this user would also delete all the user's created blogs`,
                    canProceed: true,
                },
            }
        }

        await db.user.delete({
            where: { id },
        })
        revalidatePath('/users')
        return {
            success: `User '${toBeDeletedUser.name}' successfuly deleted!`,
        }
    } catch (error) {
        return { error: `An unknown error occurred.` }
    }
}
