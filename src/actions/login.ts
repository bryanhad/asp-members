'use server'

import * as z from 'zod'
import { LoginSchema } from '@/schemas'
import { signIn } from '@/auth'
import { DEFAULT_LOGIN_REDIRECT } from '@/routes'
import { AuthError } from 'next-auth'
import { getUserByEmail } from '@/data/user'
import { generateEmailVerificationToken } from '@/lib/tokens'
import { sendEmailVerificationEmail } from '@/lib/mail'

export const loginAction = async (values: z.infer<typeof LoginSchema>) => {
    const validatedFields = LoginSchema.safeParse(values)

    if (!validatedFields.success) {
        return { error: 'Invalid fields!' }
    }

    const { email, password } = validatedFields.data

    
    try {
        const existingUser = await getUserByEmail(email)

        if (!existingUser || !existingUser.email) {
            return {error: 'Email does not exist'}
        }

        if (!existingUser.emailVerified) { // if email is still not verified, send the email verification email
            const emailVerificationToken = await generateEmailVerificationToken(existingUser.email)

            await sendEmailVerificationEmail(
                emailVerificationToken.email,
                emailVerificationToken.token,
            )

            return {success: 'Check your email to verify your account!'}
        }

        
        await signIn('credentials', {
            email,
            password,
            redirectTo: DEFAULT_LOGIN_REDIRECT,
        })
    } catch (err) {
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
