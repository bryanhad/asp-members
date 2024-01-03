import { UserRole } from '@prisma/client'
import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }), //we shouldn't limit the login password legnth, cuz we may change it in the future right?
    // it is fair to put the limitation on the RegisterForm tho
})

export const RegisterSchema = z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(6, { message: 'Minimum 6 characters required' }),
})

export const ResetPasswordSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
})

export const NewPasswordSchema = z.object({
    password: z.string().min(6, { message: 'Minimum 6 characters required' }),
})

export const SettingsSchema = z
    .object({
        name: z.optional(
            z.string().min(5, { message: 'Minimum 5 characters required' })
        ),
        role: z.enum([UserRole.ADMIN, UserRole.USER]),
        email: z.optional(z.string().email()),
        password: z.optional(
            z.string().min(6, { message: 'Minimum 6 characters required' })
        ),
        newPassword: z.optional(
            z.string().min(6, { message: 'Minimum 6 characters required' })
        ),
    })
    .refine(
        (data) => {
            if (data.password && !data.newPassword) {
                return false
            }
            return true
        },
        {
            message: 'New password is required!',
            path: ['newPassword'],
        }
    )
    .refine(
        (data) => {
            if (data.newPassword && !data.password) {
                return false
            }
            return true
        },
        {
            message: 'Password is required!',
            path: ['password'],
        }
    )
