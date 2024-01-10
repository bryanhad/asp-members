import { getAllFilteredMembers } from '@/data/member'
import { getPracticeBySlug } from '@/data/practice'
import { NextResponse } from 'next/server'

export async function GET(
    req: Request,
    { params }: { params: { slug: string } }
) {
    const origin = req.headers.get('origin')

    try {
        const practice = await getPracticeBySlug(params.slug)
        if (!practice) {
            return new NextResponse(
                JSON.stringify({ error: 'Practice not found' }),
                {
                    status: 404,
                    headers: {
                        'Access-Control-Allow-Origin': origin || '*',
                        'Content-Type': 'application/json',
                    },
                }
            )
        }
        return new NextResponse(JSON.stringify(practice), {
            headers: {
                'Access-Control-Allow-Origin': origin || '*',
                'Content-Type': 'application/json',
            },
        })
    } catch (err) {
        return new NextResponse(
            JSON.stringify({ error: 'Something went wrong!' }),
            {
                status: 500,
                headers: {
                    'Access-Control-Allow-Origin': origin || '*',
                    'Content-Type': 'application/json',
                },
            }
        )
    }
}
