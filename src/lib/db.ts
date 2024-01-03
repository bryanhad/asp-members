import { PrismaClient } from '@prisma/client'

declare global {
    var prisma: PrismaClient | undefined
}

export const db = globalThis.prisma || new PrismaClient()
// when hot reload is fired, it will check the globalThis first, if it exist, it just uses that instead of creating new prismaClient instance.

//the reason we use globalThis, is because globalThis doesn't get affected by nextJs's hot reaload

if (process.env.NODE_ENV !== 'production') globalThis.prisma = db
// if our app is not in production, store te db variable in globalThis
