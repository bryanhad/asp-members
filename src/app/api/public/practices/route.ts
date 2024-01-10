import { getAllPractices } from '@/data/practice'
import { NextResponse } from 'next/server'

export async function GET(req: Request) {
    const origin = req.headers.get('origin')

    try {
        const res = await getAllPractices()
        
        return new NextResponse(JSON.stringify(res), {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json',
            },
        })
    } catch (err) {
        return new NextResponse(JSON.stringify({ error: 'Failed to Fetch Practices' }), {
            status: 500,
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json',
            },
        })
    }


}
