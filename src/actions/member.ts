'use server'
import { getMemberById } from '@/data/member'
import { db } from '@/lib/db'
import { revalidatePath } from 'next/cache'

export const deleteMember = async (id: string) => {
    const tobeDeletedMember = await getMemberById(id)
    if (!tobeDeletedMember) {
        return { error: `Member doesn't exist!` }
    }

    await db.member.delete({
        where: { id },
    })

    revalidatePath('/members')
    return {
        success: `Member '${tobeDeletedMember.name}' successfuly deleted!`,
    }
}
