import { db } from '@/lib/db'

export const getPositionByName = async (name: string) => {
    try {
        const user = await db.position.findUnique({ where: { name } })
        return user
    } catch (err) {
        return null
    }
}
