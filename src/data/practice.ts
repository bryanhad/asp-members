import { db } from '@/lib/db'

export const getPracticeByName = async (name: string) => {
    try {
        const practice = await db.practice.findUnique({ where: { name } })
        return practice
    } catch (err) {
        return null
    }
}
export const getPracticeById = async (id: string) => {
    try {
        const practice = await db.practice.findUnique({ where: { id } })
        return practice
    } catch (err) {
        return null
    }
}
export const getPracticeByIdWithMemberCount = async (id: string) => {
    try {
        const practice = await db.practice.findUnique({
            where: { id },
            include: { _count: { select: { members: true } } },
        })
        return practice
    } catch (err) {
        return null
    }
}