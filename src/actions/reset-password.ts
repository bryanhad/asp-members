'use server'

import { ResetPasswordSchema } from '@/schemas'
import * as z from 'zod'
import { getUserByEmail } from '@/data/user'
import { generatePasswordResetToken } from '@/lib/tokens'
import { sendPasswordResetEmail } from '@/lib/mail'

export const resetPasswordAction = async (
    values: z.infer<typeof ResetPasswordSchema>
) => {
    const validatedFields = ResetPasswordSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid email' }
    }

    const { email } = validatedFields.data

    const existingUser = await getUserByEmail(email)

    if (!existingUser) {
        return { error: 'Email not found!' }
    }

    const passwordResetToken = await generatePasswordResetToken(email)
    await sendPasswordResetEmail(
        passwordResetToken.email,
        passwordResetToken.token
    )

    return { success: 'Reset password email sent!' }
}
