import { db } from '@/lib/db'

export const getUserByEmail = async (email: string) => {
    try {
        const user = await db.user.findUnique({ where: { email } })
        return user
    } catch (err) {
        return null
    }
}

export const getUserById = async (id: string) => {
    try {
        const user = await db.user.findUnique({ where: { id } })
        return user
    } catch (err) {
        return null
    }
}

export async function fetchFilteredUsers(
    query: string,
    currentPage: number,
    itemsPerPage: number
) {
    // noStore()

    const offset = (currentPage - 1) * itemsPerPage

    try {
        const users = await db.user.findMany({
            skip: offset,
            take: itemsPerPage,
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: {
                _count: {
                    select: { blogs: true },
                },
            },
            orderBy: { id: 'desc' },
        })
        return users
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Failed to fetch users')
    }
}

export async function fetchUsersPageAmount(
    query: string,
    itemsPerPage: number
) {
    try {
        const { _all } = await db.user.count({
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
        return { totalPages, count: _all }
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch total pages amount of Users.')
    }
}
