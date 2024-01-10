import { getAllPositions } from '@/data/position'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const origin = req.headers.get('origin')

    const res = await getAllPositions()

    return new NextResponse(JSON.stringify(res), {
        status: 200,
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
