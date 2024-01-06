import { getMemberByEmail, getMemberById } from '@/data/member'
import { currentRole } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateImage, uploadImage } from '@/lib/image-upload'
import { getCloudinaryPublicImageId } from '@/lib/utils'
import { AddMemberSchemaBackend, EditMemberSchemaBackend } from '@/schemas'
import { UserRole } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return new NextResponse(null, { status: 403 })
    }

    const formData = await req.formData()

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
        // joinedSince:  formData.get('joinedSince'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return NextResponse.json({ error: `Invalid fields!` }, { status: 400 })
    }

    const existingMember = await getMemberByEmail(validatedFields.data.email)
    if (existingMember) {
        return NextResponse.json(
            { error: `Member's email must be unique!` },
            { status: 409 }
        )
    }

    const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { secure_url } = await uploadImage(buffer)

    await db.member.create({
        data: {
            ...validatedFields.data,
            picture: secure_url,
        },
    })

    return NextResponse.json(
        { success: `Successfully added ${validatedFields.data.name}!` },
        { status: 200 }
    )
}
export async function PUT(req: NextRequest) {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return new NextResponse(null, { status: 403 })
    }

    const formData = await req.formData()

    const validatedFields = EditMemberSchemaBackend.safeParse({
        memberId: formData.get('memberId'),
        picture: (formData.get('picture') as File | null) || undefined,
        name: formData.get('name') || undefined,
        email: formData.get('email') || undefined,
        description: formData.get('description') || undefined,
        positionId: formData.get('positionId') || undefined,
        education: JSON.parse(
            (formData.get('education') as string | null) || '[]'
        ),
        organization: JSON.parse(
            (formData.get('organization') as string | null) || '[]'
        ),
        practices: JSON.parse(
            (formData.get('practices') as string | null) || '[]'
        ),
        // joinedSince:  formData.get('joinedSince'),
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return NextResponse.json({ error: `Invalid fields!` }, { status: 400 })
    }

    const existingMember = await getMemberById(validatedFields.data.memberId)
    if (!existingMember) {
        return NextResponse.json(
            { error: `Member not found!` },
            { status: 404 }
        )
    }

    const updateData = { ...validatedFields.data, memberId: undefined }
    let picture: string | undefined

    if (validatedFields.data.picture) {
        const arrayBuffer = await validatedFields.data.picture.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        const publicImageId = getCloudinaryPublicImageId(existingMember.picture)
        const { secure_url } = await updateImage(buffer, publicImageId)
        picture = secure_url
    }

    await db.member.update({
        where: {
            id: existingMember.id,
        },
        data: {
            ...updateData,
            picture,
        },
    })

    revalidatePath('/members')

    return NextResponse.json(
        {
            success: `Successfully updated ${
                validatedFields.data.name || existingMember.name
            }!`,
        },
        { status: 200 }
    )
}
