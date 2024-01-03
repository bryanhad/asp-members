'use server'

import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'

export const registerAction = async (
    values: z.infer<typeof RegisterSchema>
) => {
    const validatedFields = RegisterSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields' }
    }

    const { email, name, password } = validatedFields.data

    const hashedPassword = await bcrypt.hash(password, 10)

    const emailTaken = await getUserByEmail(email)

    if (emailTaken) {
        return { error: 'Email already taken!' }
    }

    await db.user.create({
        data: {
            email,
            name,
            password: hashedPassword,
        },
    })

    //TODO: Send verification email token

    return { success: 'User created!' }
}
