import { getAllFilteredMembers } from '@/data/member'
import { NextResponse } from 'next/server'


export async function GET(req: Request) {
    const origin = req.headers.get('origin')
    const url = new URL(req.url)

    const nameQuery = url.searchParams.get('name') || ''
    const positionQuery = url.searchParams.get('position') || ''

    const res = await getAllFilteredMembers(nameQuery, positionQuery)

    const data = res.map(member => {
        const position = member.position.name
        const practices = member.practices.map(el => el.practice)
        return {...member, position, practices}
    })

    return new NextResponse(JSON.stringify(data), {
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
