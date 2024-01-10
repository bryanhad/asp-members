import { db } from '@/lib/db'

export async function getBlogByTitle(title: string) {
    try {
        const blog = await db.blog.findUnique({ where: { title } })
        return blog
    } catch (err) {
        return null
    }
}
