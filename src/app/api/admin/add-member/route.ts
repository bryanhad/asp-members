import { currentRole } from '@/lib/auth'
import cloudinary, { uploadImage } from '@/lib/image-upload'
import { UserRole } from '@prisma/client'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
    const role = await currentRole()

    if (role !== UserRole.ADMIN) {
        return new NextResponse(null, { status: 403 })
    }

    const formData = await req.formData()
    const pictureFile = formData.get('picture') as File

    const arrayBuffer = await pictureFile.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)

    const bruh = await uploadImage(buffer)


    const response = {
        
    }

    return NextResponse.json(
        { success: `yeap it's a success` },
        { status: 200 }
    )
}
