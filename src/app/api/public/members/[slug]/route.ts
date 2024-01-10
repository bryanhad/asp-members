import {
    getMemberBySlug
} from '@/data/member'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    const origin = req.headers.get('origin')

    const member = await getMemberBySlug(params.slug)

    if (!member) {
        return new NextResponse(JSON.stringify({ error: 'Member not found' }), {
            status: 404,
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json',
            },
        })
    }

    return new NextResponse(JSON.stringify(member), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
