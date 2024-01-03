import authConfig from '@/auth.config'
import NextAuth from 'next-auth'

import {
    DEFAULT_LOGIN_REDIRECT,
    apiAuthPrefix,
    authRoutes,
    publicRoutes,
} from '@/routes'

const { auth } = NextAuth(authConfig) // so isntead of getting the auth from the auth.ts, we get the auth from auth.config.ts..
// this is so that our prisma could run on the middleware which runs on the edge

export default auth((req) => {
    const { nextUrl } = req
    const isLoggedIn = !!req.auth

    const isApiAuthRoute = nextUrl.pathname.startsWith(apiAuthPrefix)
    const isPublicRoute = publicRoutes.includes(nextUrl.pathname)
    const isAuthRoute = authRoutes.includes(nextUrl.pathname)

    if (isApiAuthRoute) {
        //basically don't this middleware won't do anything lol
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

    if (!isLoggedIn && !isPublicRoute) {
        //if user isn't logged in and is not on one of the public routes, get'em to login!
        return Response.redirect(new URL(`/auth/login`, nextUrl))
    }

    return null
})

// Optionally, don't invoke Middleware on some paths
export const config = {
    matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'], //run the middleware everywhere
}
