import { fetchFilteredMembers, getAllFilteredMembers } from '@/data/member'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const origin = req.headers.get('origin')
    const url = new URL(req.url)

    const query = url.searchParams.get('q') || ''

    const res = await getAllFilteredMembers(query)

    return new NextResponse(JSON.stringify(res), {
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
