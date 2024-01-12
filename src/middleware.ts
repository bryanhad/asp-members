import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicApiPrefix,
    publicRoutes,
} from '@/routes'
import { NextResponse } from 'next/server'

const { auth } = NextAuth(authConfig) // so isntead of getting the auth from the auth.ts, we get the auth from auth.config.ts..
// this is so that our prisma could run on the middleware which runs on the edge

const allowedOrigins =
    process.env.NODE_ENV === 'production'
        ? ['https://mydomain.com', 'https://www.mydomain.com']
        : ['http://localhost:3000', 'http://localhost:3001']

export default auth(async (req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth
    const origin = req.headers.get('origin')

    // console.log('middleware ran!')
    // console.log({
    //     method: req.method,
    //     url: req.url,
    //     origin,
    // })

    // if u want to block rest API tools like thunderclient or postman, u can add condittion for no origin.. (!origin)
    if (origin && !allowedOrigins.includes(origin)) {
        return new NextResponse(null, {
            status: 400,
            statusText: 'Bad Request',
            headers: {
                'Content-Type': 'text/plain',
            },
        })
    }

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)
    const isPublicApiRoute = nextUrl.pathname.startsWith(publicApiPrefix)
    // const isAdminRoute = adminRoutes.some((route) => {
    //     const matchingStart = nextUrl.pathname.startsWith(route.start)
    //     const matchingEnd = nextUrl.pathname.endsWith(route.end)
    //     return matchingStart && matchingEnd
    // })

    if (isApiAuthRoute) {
        //null means that this middleware won't do anything lol
        return null
    }

    if (isPublicApiRoute) {
        return null
    }

    if (isAuthRoute) {
        if (isLoggedIn) {
            // if logged in User tries to access auth route, shoo'em!
            return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
            //you need to pass the second param of the nextUrl, cuz then, it will create an absolute url of 'localhost:3000/blabla' instead of '/blabla'
        }
        return null
    }

    // if (isAdminRoute) {
    //     if (req.auth && req.auth.user.role !== 'ADMIN') {
    //         const session = await auth()
    //         console.log(session)

    //         console.log(
    //             'INI NGECEK APAKAH LU ADMIN APA BUKAN >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>'
    //         )
    //         console.log(req.auth.user)
    //         return Response.redirect(new URL(DEFAULT_LOGIN_REDIRECT, nextUrl))
    //     }
    // }

    if (!isLoggedIn && !isPublicRoute) {
        let callbackUrl = nextUrl.pathname
        if (nextUrl.search) {
            callbackUrl += nextUrl.search
        }

        const encodedCallbackUrl = encodeURIComponent(callbackUrl)

        //if user isn't logged in and is not on one of the public routes, get'em to login!
        return Response.redirect(
            new URL(`/auth/login?callbackUrl=${encodedCallbackUrl}`, nextUrl)
        )
    }

    return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'], //run the middleware everywhere
}
