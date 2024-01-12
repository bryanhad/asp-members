import { Blog, User } from '@prisma/client'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { FaUser } from 'react-icons/fa'
import { dateToString } from '@/lib/utils'
import Link from 'next/link'
import { BlogCard } from './blog-card'
import { Badge } from '@/components/ui/badge'
import LoadingButton from '@/components/loading-button'
import { LoadMoreButton } from '@/components/load-more-button'

type UserViewProps = {
    userWithBlogs: {
        blogs: Blog[]
        _count: {
            blogs: number
        }
    } & User
    currentPage: number
}

export const UserView = ({
    userWithBlogs: { blogs, _count, ...user },
    currentPage,
}: UserViewProps) => {
    return (
        <div >
            <section className="flex items-center gap-4 flex-col sm:flex-row">
                <Avatar className="h-28 w-28 rounded-full">
                    <AvatarImage src={user.profilePic || ''} />
                    <AvatarFallback className="bg-secondary rounded-md">
                        <FaUser className="text-5xl text-muted-foreground/30" />
                    </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-1 text-sm items-center sm:items-start">
                    <h1>{user.name}</h1>
                    <p>{user.email}</p>
                        <Badge
                            variant={
                                user.role === 'ADMIN' ? 'default' : 'outline'
                            }
                        >
                            {user.role}
                        </Badge>
                    {user.emailVerified && (
                        <p className='text-muted-foreground'>
                            Joined Since:{' '}
                            {dateToString(user.emailVerified, 'long')}
                        </p>
                    )}
                </div>
            </section>
            <section className="mt-4 border rounded-md p-4 flex flex-col items-center sm:items-start">
                <h2 className="font-semibold text-xl mb-2">Blogs Written</h2>
                {blogs.length ? (
                    <>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
                            {blogs.map((blog) => (
                                <Link
                                    key={blog.id}
                                    href={`/blogs/${blog.slug}/edit`}
                                >
                                    <BlogCard blog={blog} />
                                </Link>
                            ))}
                        </div>
                        <div className="flex justify-center">
                            <LoadMoreButton
                                className="mt-4"
                                currentPage={currentPage}
                                shownItemsCount={blogs.length}
                                totalDataCount={_count.blogs}
                            />
                        </div>
                    </>
                ) : (
                    <p className="text-muted-foreground italic text-sm">
                        This User haven&apos;t written any blogs yet!
                    </p>
                )}
            </section>
        </div>
    )
}
