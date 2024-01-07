import { db } from '@/lib/db'

export const getPositionByName = async (name: string) => {
    try {
        const position = await db.position.findUnique({ where: { name } })
        return position
    } catch (err) {
        return null
    }
}
export const getPositionById = async (id: string) => {
    try {
        const position = await db.position.findUnique({ where: { id } })
        return position
    } catch (err) {
        return null
    }
}
export const getPositionByIdWithMemberCount = async (id: string) => {
    try {
        const position = await db.position.findUnique({
            where: { id },
            include: { _count: { select: { members: true } } },
        })
        return position
    } catch (err) {
        return null
    }
}

export const fetchFilteredPositions = async (
    query: string,
    currentPage: number,
    itemsPerPage: number
) => {
    // noStore()

    const offset = (currentPage - 1) * itemsPerPage

    try {
        const positions = await db.position.findMany({
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
        return positions
    } catch (err) {
        throw new Error('Failed to fetch Positions.')
    }
}

export async function fetchPositionsPageAmount(
    query: string,
    itemsPerPage: number
) {
    try {
        const { _all } = await db.position.count({
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
        throw new Error('Failed to fetch total pages amount of Positions.')
    }
}
