'use server'

import { db } from '@/lib/db'
import { getUserByEmail } from '@/data/user'
import { getEmailVerificationTokenByToken } from '@/data/email-verification-token'

export const verifyEmailAction = async (token: string) => {
    const existingToken = await getEmailVerificationTokenByToken(token)

    if (!existingToken) {
        return { error: 'Token does not exist!' }
    }

    const hasExpired = new Date(existingToken.expires) < new Date()

    if (hasExpired) {
        return { error: 'Token has expired!' }
    }

    const existingUser = await getUserByEmail(existingToken.email)

    if (!existingUser) {
        return { error: 'Email does not exist!' }
    }

    await db.user.update({
        where: { id: existingUser.id },
        data: {
            emailVerified: new Date(),
            email: existingToken.email, //we also update the email for the case if this func is called for resetting email (changing email)
        },
    })

    await db.emailVerificationToken.delete({ where: { id: existingToken.id } })

    return { success: 'Email verified. Now you can login!' }
}
