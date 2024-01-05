'use server'
import { uploadImageSchema } from '@/schemas'
import * as z from 'zod'

export const addMember = async (formData: FormData) => {
    const picture = formData.get('picture') as File
    // const validatedFields = uploadImageSchema.safeParse(values)

    // if (!validatedFields.success) {
    //     return { error: 'Invalid fields!' }
    // }

    // const { picture } = validatedFields.data
    console.log(picture)
}
