'use server'

import { uploadImage } from '@/lib/image-upload'

export const uploadImageToCloudinary = async (formData: FormData, folder:string) => {
    const file = formData.get('file') as File

    const arrayBuffer = await file.arrayBuffer()
    const buffer = new Uint8Array(arrayBuffer)
    const { secure_url } = await uploadImage(buffer, folder)
    return secure_url
}
