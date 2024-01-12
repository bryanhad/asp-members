import { getUserByIdWithBlogs } from '@/data/user'
import { UserView } from '../_components/user-view'

type ViewUserPageProps = {
    params: { id: string }
    searchParams?: {
        page?: string
    }
}

export default async function ViewUserPage({
    params: { id },
    searchParams,
}: ViewUserPageProps) {
    const currentPage = Number(searchParams?.page) || 1

    const userWithBlogs = await getUserByIdWithBlogs(id, currentPage)

    if (!userWithBlogs) {
        return <p>User Not Found</p>
    }

    return <UserView userWithBlogs={userWithBlogs} currentPage={currentPage} />
}
