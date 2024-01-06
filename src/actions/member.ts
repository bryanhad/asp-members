'use server'
import { getMemberById } from '@/data/member'
import { db } from '@/lib/db'
import { deleteImage } from '@/lib/image-upload'
import { revalidatePath } from 'next/cache'

export const deleteMember = async (id: string) => {
    const tobeDeletedMember = await getMemberById(id)
    if (!tobeDeletedMember) {
        return { error: `Member doesn't exist!` }
    }

    const splitArr = tobeDeletedMember.picture.split('/')
    const publicImageId = splitArr[splitArr.length-1].split('.')[0]

    await db.member.delete({
        where: { id },
    })
    await deleteImage(publicImageId)

    revalidatePath('/members')
    return {
        success: `Member '${tobeDeletedMember.name}' successfuly deleted!`,
    }
}
