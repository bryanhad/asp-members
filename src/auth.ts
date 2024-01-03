import NextAuth from 'next-auth'
import authConfig from '@/auth.config'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { db } from '@/lib/db'
import { getUserById } from '@/data/user'
import { UserRole } from '@prisma/client'

export const {
    handlers: { GET, POST },
    auth,
    signIn,
    signOut,
} = NextAuth({
    pages: {
        signIn: '/auth/login',
        error: '/auth/error'
    },
    adapter: PrismaAdapter(db),
    session: { strategy: 'jwt' }, // we can't use session db in prisma. cuz prisma doesn't work on the edge
    ...authConfig,
    callbacks: {
        async jwt({ token }) { // on this token, we will get the user's id on the sub field in the token object

            if (!token.sub) {
                //no sub, means that the user is logged out.
                return token
            }

            const existingUser = await getUserById(token.sub)
            if (!existingUser) return token

            token.role = existingUser.role
            token.profilePic = existingUser.profilePic

            return token
        },
        async session({ token, session }) {
            if (token.sub && session.user) {
                session.user.id = token.sub
            }
            if (token.role && session.user) {
                session.user.role = token.role as UserRole
            }
            if (token.profilePic && session.user) {
                session.user.profilePic = token.profilePic as string | null
            }
            return session
        },
        async signIn({user}) { //return false to not allow signIn, and true to allow
            const existingUser = await getUserById(user.id)

            if (!existingUser || !existingUser.emailVerified) {
                return false
            }

            return true
        },
    },
})
