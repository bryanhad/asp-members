import { db } from '@/lib/db'

export const getMemberByEmail = async (email: string) => {
    try {
        const member = await db.member.findUnique({ where: { email } })
        return member
    } catch (err) {
        return null
    }
}
export const getMemberById = async (id: string) => {
    try {
        const member = await db.member.findUnique({
            where: { id },
            include: { position: true },
        })
        return member
    } catch (err) {
        return null
    }
}

export async function fetchFilteredMembers(
    query: string,
    currentPage: number,
    itemsPerPage: number
) {
    // noStore()

    const offset = (currentPage - 1) * itemsPerPage

    try {
        const members = await db.member.findMany({
            skip: offset,
            take: itemsPerPage,
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: { position: true },
            orderBy: { id: 'desc' },
        })
        return members
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Failed to fetch members')
    }
}

export async function fetchMembersPageAmount(
    query: string,
    itemsPerPage: number
) {
    // noStore()
    try {
        const { _all } = await db.member.count({
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            select: {
                _all: true,
            },
        })
        const totalPages = Math.ceil(Number(_all) / itemsPerPage)
        return totalPages
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch total pages amount of Members.')
    }
}
