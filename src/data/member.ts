import { db } from '@/lib/db'
import { unstable_noStore as noStore } from 'next/cache'

export const getMemberByEmail = async (email: string) => {
    try {
        const member = await db.member.findUnique({ where: { email } })
        return member
    } catch (err) {
        return null
    }
}
export const getMemberById = async (id: string) => {
    noStore()
    try {
        const member = await db.member.findUnique({
            where: { id },
        })
        return member
    } catch (err) {
        return null
    }
}
export const getMemberBySlug = async (slug: string) => {
    noStore()
    try {
        const member = await db.member.findUnique({
            where: { slug },
            include: {
                position: {select: {name:true}},
                practices: {
                    select: {
                        practice: {
                            select: {
                                id: true,
                                icon: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            }
        })
        return member
    } catch (err) {
        return null
    }
}
export const getMemberByIdWithPractices = async (id: string) => {
    noStore()
    try {
        const member = await db.member.findUnique({
            where: { id },
            include: {
                practices: {
                    select: { practice: { select: { name: true } } },
                },
            },
        })
        if (!member) {
            throw 'bruh'
        }
        const memberWithPractices = {
            ...member,
            practices: member.practices.map((el) => el.practice.name),
        }
        return memberWithPractices
    } catch (err) {
        throw new Error('Failed to fetch Member')
    }
}
export const getMemberByIdWithPosition = async (id: string) => {
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
export const getMemberByIdWithPositionAndPractices = async (id: string) => {
    try {
        const member = await db.member.findUnique({
            where: { id },
            include: {
                position: true,
                practices: { select: { practice: true } },
            },
        })
        if (!member) {
            throw 'bruh'
        }

        const memberPractices = member.practices.map((el) => el.practice)
        return { ...member, practices: memberPractices }
    } catch (err) {
        throw new Error('Failed to fetch Member')
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
        return { totalPages, count: _all }
    } catch (error) {
        console.error('Database Error:', error)
        throw new Error('Failed to fetch total pages amount of Members.')
    }
}

export async function getAllFilteredMembers(nameQuery: string) {
    noStore()
    try {
        const members = await db.member.findMany({
            where: {
                name: {
                    contains: nameQuery,
                    mode: 'insensitive',
                },
            },
            include: {
                position: {select: {name:true}},
                practices: {
                    select: {
                        practice: {
                            select: {
                                id: true,
                                icon: true,
                                name: true,
                                slug: true,
                            },
                        },
                    },
                },
            },
            orderBy: { id: 'desc' },
        })
        return members
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Failed to fetch members')
    }
}
