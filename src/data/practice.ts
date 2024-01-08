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
        if (!practice) throw Error('bruh')
        return practice
    } catch (err) {
        throw new Error('Failed to fetch Practice')

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

export const getAllPractices = async () => {
    try {
        const practice = await db.practice.findMany()
        return practice
    } catch (err) {
        throw new Error('Failed to fetch Practices.')
    }
}

export const fetchFilteredPractices = async (
    query: string,
    currentPage: number,
    itemsPerPage: number
) => {
    // noStore()

    const offset = (currentPage - 1) * itemsPerPage

    try {
        const practices = await db.practice.findMany({
            skip: offset,
            take: itemsPerPage,
            where: {
                name: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            orderBy: { id: 'desc' },
            include: {
                _count: {
                    select: { members: true },
                },
            },
        })
        return practices
    } catch (err) {
        throw new Error('Failed to fetch Practices.')
    }
}

export async function fetchPracticesPageAmount(
    query: string,
    itemsPerPage: number
) {
    try {
        const { _all } = await db.practice.count({
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
        return {totalPages, count: _all}
    } catch (error) {
        throw new Error('Failed to fetch total pages amount of Practices.')
    }
}
