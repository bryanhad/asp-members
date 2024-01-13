import {
    getAllMembersSlug,
    getMemberBySlugdWithPositionAndPractices,
} from '@/data/member'
import { getAllPositions } from '@/data/position'
import { getAllPractices } from '@/data/practice'
import EditMemberForm from './form'
import { currentRole } from '@/lib/auth'
import { Metadata } from 'next'
import { cache } from 'react'
import { notFound } from 'next/navigation'

type EditMemberPageProps = {
    params: { slug: string }
}

export async function generateStaticParams() {
    const slugs = await getAllMembersSlug()
    return slugs.map((slug) => ({ slug }))
}

const getMemberData = cache(async (slug: string) => {
    const member = await getMemberBySlugdWithPositionAndPractices(slug)
    return member
})

export async function generateMetadata({
    params: { slug },
}: EditMemberPageProps): Promise<Metadata> {
    const member = await getMemberData(slug)

    if (!member) {
        return {
            title: 'Member Not Found',
        }
    }
    return {
        title: member.name,
        description: `${member.name}'s edit page`,
    }
}

export default async function EditMemberPage({
    params: { slug },
}: EditMemberPageProps) {
    const role = await currentRole()
    if (role !== 'ADMIN') {
        throw Error(`Only user with role 'ADMIN' can view this page`)
    }

    const [member, positions, practices] = await Promise.all([
        getMemberData(slug),
        getAllPositions(),
        getAllPractices(),
    ])

    if (!member) return notFound()

    return (
        <EditMemberForm
            positions={positions}
            member={member}
            practices={practices}
        />
    )
}
