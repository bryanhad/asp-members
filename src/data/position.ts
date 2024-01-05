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

const ITEMS_PER_PAGE = 4
export const fetchFilteredPositions = async (
    query: string,
    currentPage: number
) => {
    // noStore()

    const offset = (currentPage - 1) * ITEMS_PER_PAGE

    try {
        const positions = await db.position.findMany({
            skip: offset,
            take: ITEMS_PER_PAGE,
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
        return null
    }
}

export async function fetchPositionsPageAmount(query: string) {
    // noStore()
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
        const totalPages = Math.ceil(Number(_all) / ITEMS_PER_PAGE)
        return totalPages
    } catch (error) {
        return null
    }
}

export async function getAllPositions() {
    try {
        const positions = await db.position.findMany()
        return positions
    } catch (err) {
        return null
    }
}
