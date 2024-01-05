import { getMemberByEmail } from '@/data/member'
import { currentRole } from '@/lib/auth'
import { db } from '@/lib/db'
import cloudinary, { uploadImage } from '@/lib/image-upload'
import { AddMemberSchemaBackend } from '@/schemas'
import { UserRole } from '@prisma/client'
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
        description: formData.get('description'),
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
        return NextResponse.json(
            { error: `Invalid fields!` },
            { status: 400 }
        )
    }

    const {
        name,
        email,
        picture,
        positionId,
        description,
        education,
        organization,
        practices,
    } = validatedFields.data

    const arrayBuffer = await picture.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const { secure_url } = await uploadImage(buffer)

    // console.log({
    //     ...validatedFields.data,
    //     picture: secure_url
    // })

    const existingMember = await getMemberByEmail(email)
    if (existingMember) {
        return NextResponse.json(
            { error: `Member's email must be unique!` },
            { status: 409 }
        )
    }

    await db.member.create({
        data: {
            ...validatedFields.data,
            picture: secure_url
        }
    })

    return NextResponse.json(
        { success: `Successfully added ${name}!` },
        { status: 200 }
    )
}
