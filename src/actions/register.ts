'use server'

import * as z from 'zod'
import { RegisterSchema } from '@/schemas'
import bcrypt from 'bcryptjs'
import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { generateEmailVerificationToken } from '@/lib/tokens'
import { sendEmailVerificationEmail } from '@/lib/mail'

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

    // bear in mind that the user could just not verify their acccount when they register their account..
    // so at this point, the record for the new user has been created, but the emailVerification is still empty..
    // so we should also send the verificationEmail in the login action, if the user's user record email isn't verified

    const emailVerificationToken = await generateEmailVerificationToken(email)

    await sendEmailVerificationEmail(
        emailVerificationToken.email,
        emailVerificationToken.token,
    )

    return { success: 'Check your email to verify your account!' }
}
