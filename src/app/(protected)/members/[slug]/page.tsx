import {
    getAllMembersSlug,
    getMemberBySlugdWithPositionAndPractices,
} from '@/data/member'
import MemberView from '../_components/view'
import { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'

type ViewMemberPageProps = {
    params: { slug: string }
}

export async function generateStaticParams() {
    const slugs = await getAllMembersSlug()
    return slugs.map((slug) => ({ slug }))
}

const getMemberData = cache(async (slug:string) => {
    const member = await getMemberBySlugdWithPositionAndPractices(slug)
    return member
})

export async function generateMetadata({
    params: { slug },
}: ViewMemberPageProps): Promise<Metadata> {
    const member = await getMemberData(slug)

    if (!member) {
        return {
            title: 'Member Not Found'
        }
    }
    return {
        title: member.name,
        description: `${member.name}'s page`
    }
}


export default async function ViewMemberPage({
    params: { slug },
}: ViewMemberPageProps) {
    const member = await getMemberData(slug)
    
    if (!member) return notFound()

    return <MemberView member={member} />
}
