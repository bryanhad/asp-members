import { getEmailVerificationTokenByEmail } from '@/data/email-verification-token'
import { v4 as uuid } from 'uuid'
import { db } from '@/lib/db'

export const generateEmailVerificationToken = async (email: string) => {
    const token = uuid()
    const expires = new Date(new Date().getTime() + 1000 * 60 * 60) //expires in 1 hour (in ms)

    const existingToken = await getEmailVerificationTokenByEmail(email)
    if (existingToken) {
        await db.emailVerificationToken.delete({
            where: { id: existingToken.id },
        })
    }

    const verificationToken = await db.emailVerificationToken.create({
        data: { email, token, expires },
    })
    return verificationToken
}
