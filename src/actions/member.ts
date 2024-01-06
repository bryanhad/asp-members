'use server'
import { getMemberById } from '@/data/member'
import { db } from '@/lib/db'
import { deleteImage } from '@/lib/image-upload'
import { getCloudinaryPublicImageId } from '@/lib/utils'
import { revalidatePath } from 'next/cache'

export const deleteMember = async (id: string) => {
    const tobeDeletedMember = await getMemberById(id)
    if (!tobeDeletedMember) {
        return { error: `Member doesn't exist!` }
    }

    const publicImageId = getCloudinaryPublicImageId(tobeDeletedMember.picture)

    await db.member.delete({
        where: { id },
    })
    await deleteImage(publicImageId)

    revalidatePath('/members')
    return {
        success: `Member '${tobeDeletedMember.name}' successfuly deleted!`,
    }
}
