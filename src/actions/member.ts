'use server'
import { getMemberByEmail, getMemberById } from '@/data/member'
import { currentRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { deleteImage, uploadImage } from '@/lib/image-upload'
import { getCloudinaryPublicImageId } from '@/lib/utils'
import { AddMemberSchemaBackend } from '@/schemas'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const addMember = async (formData: FormData) => {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = AddMemberSchemaBackend.safeParse({
        picture: formData.get('picture') as File,
        name: formData.get('name'),
        email: formData.get('email'),
        description: formData.get('description') || undefined,
        positionId: formData.get('positionId'),
        education: JSON.parse(
            (formData.get('education') as string | null) || '[]'
        ),
        organization: JSON.parse(
            (formData.get('organization') as string | null) || '[]'
        ),
        practices: JSON.parse(
            (formData.get('practices') as string | null) || '[]'
        ),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: `Invalid fields!` }
    }

    try {
        const existingMember = await getMemberByEmail(
            validatedFields.data.email
        )
        if (existingMember) {
            return { error: `Member's email must be unique!` }
        }

        const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const { secure_url } = await uploadImage(buffer, 'member')

        const newMember = await db.member.create({
            data: {
                ...validatedFields.data,
                picture: secure_url,
                practices: undefined,
            },
        })
        // ADD MEMBER'S PRACTICES IN CONJUNC TABLE
        if (
            validatedFields.data.practices &&
            validatedFields.data.practices.length >= 1
        ) {
            const newMemberPractices = validatedFields.data.practices.map(
                (practice) => {
                    return {
                        memberId: newMember.id,
                        practiceId: practice,
                    }
                }
            )
            await db.membersOnPractice.createMany({
                data: newMemberPractices,
            })
        }

        revalidatePath('/members')
        return { success: `Successfully added ${validatedFields.data.name}!` }
    } catch (err) {
        console.log(err)
        return { error: `Something went wrong!` }
    }
}

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
