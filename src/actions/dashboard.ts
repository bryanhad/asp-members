import { db } from '@/lib/db'

export const getDashboardData = async () => {
    try {
        const [
            usersCount,
            blogsCount,
            membersCount,
            positionsCount,
            practicesCount,
        ] = await Promise.all([
            db.user.count(),
            db.blog.count(),
            db.member.count(),
            db.position.count(),
            db.practice.count(),
        ])
        return {
            usersCount,
            blogsCount,
            membersCount,
            positionsCount,
            practicesCount,
        }
    } catch (err) {
        throw Error('Failed to fetch dashbord data')
    }
}
