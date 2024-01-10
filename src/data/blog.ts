import { db } from '@/lib/db'

export async function getBlogByTitle(title: string) {
    try {
        const blog = await db.blog.findUnique({ where: { title } })
        return blog
    } catch (err) {
        return null
    }
}

export async function fetchFilteredBlogs(
    query: string,
    currentPage: number,
    itemsPerPage: number
) {
    // noStore()

    const offset = (currentPage - 1) * itemsPerPage

    try {
        const blogs = await db.blog.findMany({
            skip: offset,
            take: itemsPerPage,
            where: {
                title: {
                    contains: query,
                    mode: 'insensitive',
                },
            },
            include: {
                author: { select: { id: true, name: true, profilePic: true } },
                category: { select: { id: true, name: true } },
            },
            orderBy: { id: 'desc' },
        })
        return blogs
    } catch (err) {
        console.error('Database Error:', err)
        throw new Error('Failed to fetch blogs')
    }
}

export async function fetchBlogsPageAmount(
    query: string,
    itemsPerPage: number
) {
    try {
        const { _all } = await db.blog.count({
            where: {
                title: {
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
        throw new Error('Failed to fetch total pages amount of Blogs.')
    }
}
