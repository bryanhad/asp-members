import { db } from '@/lib/db'

export const getEmailVerificationTokenByEmail = async (email: string) => {
    try {
        const emailVerificationToken =
            await db.emailVerificationToken.findFirst({
                where: { email },
            })
        return emailVerificationToken
    } catch (err) {
        return null
    }
}

export const getEmailVerificationTokenByToken = async (token: string) => {
    try {
        const emailVerificationToken =
            await db.emailVerificationToken.findUnique({
                where: { token },
            })
        return emailVerificationToken
    } catch (err) {
        return null
    }
}
