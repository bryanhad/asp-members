import { db } from '@/lib/db'

export const getMemberByEmail = async (email: string) => {
    try {
        const user = await db.member.findUnique({ where: { email } })
        return user
    } catch (err) {
        return null
    }
}

