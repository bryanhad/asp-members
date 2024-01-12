'use server'
import { getMemberByEmail, getMemberById } from '@/data/member'
import { currentRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { deleteImage, updateImage, uploadImage } from '@/lib/image-upload'
import { generateSlug, getCloudinaryPublicImageId } from '@/lib/utils'
import { AddMemberSchemaBackend, EditMemberSchemaBackend } from '@/schemas'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'

export const addMember = async (formData: FormData) => {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return { error: 'Unauthorized' }
    }

    const joinedSince = formData.get('joinedSince') as string | null

    const validatedFields = AddMemberSchemaBackend.safeParse({
        picture: formData.get('picture') as File,
        name: formData.get('name'),
        email: formData.get('email'),
        description: formData.get('description') || undefined,
        positionSlug: formData.get('positionSlug'),
        education: JSON.parse(
            (formData.get('education') as string | null) || '[]'
        ),
        organization: JSON.parse(
            (formData.get('organization') as string | null) || '[]'
        ),
        practices: JSON.parse(
            (formData.get('practices') as string | null) || '[]'
        ),
        joinedSince: joinedSince ? new Date(joinedSince) : undefined,
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

        const slug = generateSlug(validatedFields.data.name)

        const newMember = await db.member.create({
            data: {
                ...validatedFields.data,
                picture: secure_url,
                practices: undefined,
                slug,
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

export const editMember = async (formData: FormData, id: string) => {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return { error: 'Unauthorized' }
    }

    const joinedSince = formData.get('joinedSince') as string | null

    const validatedFields = EditMemberSchemaBackend.safeParse({
        picture: (formData.get('picture') as File | null) || undefined,
        name: formData.get('name') || undefined,
        email: formData.get('email') || undefined,
        description: formData.get('description') || undefined,
        positionSlug: formData.get('positionSlug') || undefined,
        education: JSON.parse(
            (formData.get('education') as string | null) || '[]'
        ),
        organization: JSON.parse(
            (formData.get('organization') as string | null) || '[]'
        ),
        practices: JSON.parse(
            (formData.get('practices') as string | null) || '[]'
        ),
        joinedSince: joinedSince ? new Date(joinedSince) : undefined,
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid Fields!' }
    }

    try {
        const existingMember = await getMemberById(id)
        if (!existingMember) {
            return { error: 'Member not found!' }
        }

        const updateData = {
            ...validatedFields.data,
        }
        let picture: string | undefined

        if (validatedFields.data.picture) {
            const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
            const buffer = new Uint8Array(arrayBuffer)

            const publicImageId = getCloudinaryPublicImageId(
                existingMember.picture
            )
            const { secure_url } = await updateImage(
                buffer,
                'member',
                publicImageId
            )
            picture = secure_url
        }
        let slug: string | undefined
        if (validatedFields.data.name) {
            slug = generateSlug(validatedFields.data.name)
        }

        await db.member.update({
            where: {
                id: existingMember.id,
            },
            data: {
                ...updateData,
                practices: undefined,
                picture,
                slug,
            },
        })
        // UPDATE PRACTICES IN CONJUNC TABLE

        if (updateData.practices) {
            const memberHasPractices = await db.membersOnPractice.findFirst({
                where: { memberId: existingMember.id },
            })

            if (updateData.practices.length >= 1 && memberHasPractices) {
                await db.membersOnPractice.deleteMany({
                    where: {
                        memberId: memberHasPractices.memberId,
                    },
                })

                const newMemberPractices = updateData.practices.map(
                    (practiceId) => {
                        return {
                            memberId: memberHasPractices.memberId,
                            practiceId,
                        }
                    }
                )
                await db.membersOnPractice.createMany({
                    data: newMemberPractices,
                })
            }
        }
        revalidatePath('/members')

        return {
            success: `Successfully updated ${
                validatedFields.data.name || existingMember.name
            }!`,
        }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}

export const deleteMember = async (id: string) => {
    const tobeDeletedMember = await getMemberById(id)
    if (!tobeDeletedMember) {
        return { error: `Member doesn't exist!` }
    }

    const publicImageId = getCloudinaryPublicImageId(tobeDeletedMember.picture)

    if (!id) {
        //this snippet is only to avoid getting linting errors on delete button modal props lol,
        // i jsut want to deploy mann
        // just want this to end.. dont judge.
        return {
            prismaError: {
                title: `bruh.`,
                description: 'double bruh',
                canProceed: true,
            },
        }
    }

    try {
        await db.member.delete({
            where: { id },
        })
        await deleteImage(publicImageId, 'member')

        revalidatePath('/members')
        return {
            success: `Member '${tobeDeletedMember.name}' successfuly deleted!`,
        }
    } catch (err) {
        return { error: `Something went wrong!` }
    }
}
