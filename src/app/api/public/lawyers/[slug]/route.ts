import {
    getMemberBySlug
} from '@/data/member'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    const origin = req.headers.get('origin')

    const lawyer = await getMemberBySlug(params.slug)

    if (!lawyer) {
        return new NextResponse(JSON.stringify({ error: 'Member not found' }), {
            status: 404,
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json',
            },
        })
    }

        const position = lawyer.position.name
        const practices = lawyer.practices.map(el => el.practice)

    return new NextResponse(JSON.stringify({...lawyer, position, practices}), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
