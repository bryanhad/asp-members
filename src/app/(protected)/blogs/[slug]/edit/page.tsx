import { getBlogBySlug } from '@/data/blog'
import { getAllPractices } from '@/data/practice'
import EditBlogForm from './form'

type EditBlogPageProps = {
    params: { slug: string }
}

export default async function EditBlogPage({
    params: { slug },
}: EditBlogPageProps) {
    const blog = await getBlogBySlug(slug)
    const categories = await getAllPractices()

    return <EditBlogForm blog={blog} categories={categories} />
}
