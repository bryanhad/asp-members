import { dateToString } from '@/lib/utils'
import { Blog } from '@prisma/client'
import Image from 'next/image'

type BlogCardProps = {
    blog: Blog
}

export const BlogCard = ({ blog }: BlogCardProps) => {
    return (
        <div className="flex flex-col rounded-md overflow-hidden border">
            <div className="h-[200px] ">
                <Image
                    alt={`${blog.title}'s thumbnail`}
                    src={blog.picture}
                    width={200}
                    height={100}
                    className="object-cover w-full h-full"
                />
            </div>
            <div className="p-4 flex-[1] flex flex-col">
                <p className="font-semibold text-lg">{blog.title}</p>
                <p className="text-muted-foreground text-sm">
                    {dateToString(blog.createdAt, 'long')}
                </p>
            </div>
        </div>
    )
}
