import { fetchFilteredMembers } from '@/data/member'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const origin = req.headers.get('origin')
    const url = new URL(req.url)

    const query = url.searchParams.get('q') || ''
    const page = Number(url.searchParams.get('page') || 1)
    const size = Number(url.searchParams.get('size') || 6)

    const res = await fetchFilteredMembers(query, page, size)

    return new NextResponse(JSON.stringify(res), {
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
