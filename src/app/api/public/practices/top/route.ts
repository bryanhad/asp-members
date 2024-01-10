import { db } from '@/lib/db'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const origin = req.headers.get('origin')

    const data = await db.practice.findMany({
        where: {
            name: {
                mode: 'insensitive',
                in: ['kepailitan', 'pkpu', 'hukum perdata'],
            },
        },
    })

    return new NextResponse(JSON.stringify(data), {
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json',
        },
    })
}
