'use server'

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { sendEmailVerificationEmail } from '@/lib/mail'
import { generateEmailVerificationToken } from '@/lib/tokens'
import { SettingsSchema } from '@/schemas'
import * as z from 'zod'
import bcrypt from 'bcryptjs'

export const settingsAction = async (
    values: z.infer<typeof SettingsSchema>
) => {
    const user = await currentUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
        return { error: 'Unauthorized' }
    }

    if (values.email && values.email !== user.email) {
        //we only send the verification email if the entered new email is different thant he current one
        const existingUser = await getUserByEmail(values.email)

        if (existingUser && existingUser.id !== user.id) {
            //if the new email is used by other and the person is different that the user,
            return { error: 'Email already taken' }
        }

        const verificationToken = await generateEmailVerificationToken(
            values.email
        )

        await sendEmailVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return {success: 'Verification email sent!'}
    }

    if (values.password && values.newPassword) {
        const passwordMatch = await bcrypt.compare(
            values.password,
            dbUser.password,
        )

        if (!passwordMatch) {
            return {error: `Old password doesn't match!`}
        }

        const hashedPassword = await bcrypt.hash(values.newPassword, 10)
        
        values.password = hashedPassword //reasign the password so prisma would update it with the new hashed Password
        values.newPassword = undefined // so that prisma wouldn't input this field
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: { ...values },
    })

    return { success: 'Settings Updated!' }
}
