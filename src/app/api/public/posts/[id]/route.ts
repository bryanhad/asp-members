import { NextResponse } from "next/server";

type Props = {
    params: {id:string}
}

export async function GET(req: Request, {params: {id}}:Props) {
    const DATA_SOURCE_URL = `https://jsonplaceholder.typicode.com/posts/${id}`

    const res = await fetch(DATA_SOURCE_URL)
    const data = await res.json()

    return NextResponse.json(data)
}