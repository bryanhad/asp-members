import { NextResponse } from 'next/server'
import { limiter } from '../../config/limiter'

const DATA_SOURCE_URL = 'https://jsonplaceholder.typicode.com/posts'

export async function GET(req: Request) {
    const origin = req.headers.get('origin')
    const remaining = await limiter.removeTokens(1)

    console.log({ remainingToken: remaining })
    if (remaining < 0) {
        return NextResponse.json(
            { message: 'Exceeded rate limit' },
            {
                status: 429,
                statusText: 'Too Many Requests',
                headers: {
                    'Access-Control-Allowed-Origin': '*',
                },
            }
        )
    }

    const res = await fetch(DATA_SOURCE_URL)
    const data = await res.json()

    return new NextResponse(JSON.stringify(data), {
        headers: {
            'Access-Control-Allow-Origin': origin || '*',
            'Content-Type': 'application/json'
        }
    })
}
