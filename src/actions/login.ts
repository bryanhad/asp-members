'use server'

import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { email, password } = validatedFields.data

    try {
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (err) {
        // TODO
        if (err instanceof AuthError) {
            switch (err.type) {
                case 'CredentialsSignin': 
                    return {error: 'Invalid credentials!'}
                default:
                    return {error: 'Something went wrong!'}
            }
        }

        throw err //make sure to throw the error so that the user can be redirected to the 'redirectTo' in signIn
    }
}
