import { UserRole } from '@prisma/client'
import { File } from 'buffer'
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

export const PositionsSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Position name must be atleast 4 characters long' }),
})

export const AddMemberSchema = z.object({
    name: z.string().min(4, { message: 'Minimum 4 characters required' }),
    email: z.string().email({ message: 'Email is required' }),
    picture: z.string().min(1, { message: 'Picture is required' }),
    description: z.optional(
        z.string().min(10, { message: 'Minimum 10 characters required' })
    ),
    education: z.optional(z.array(z.string())),
    organization: z.optional(z.array(z.string())),
    practices: z.optional(z.array(z.string())),
    positionId: z
        .string()
        .min(4, { message: 'Please select one of the positions' }),
})

const MAX_IMAGE_SIZE = 500_880 // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

// Form Schema Validation
export const uploadImageSchema = z.object({
    picture: z
        .custom<FileList>((val) => val instanceof FileList, 'Required')
        .refine((files) => files.length > 0, `Required`)
        .refine((files) => files.length <= 1, `Can only select 1 image.`)
        .refine((files) => {
            if (files[0] && files[0].type) {
                return ALLOWED_IMAGE_TYPES.includes(files[0].type)
            }
        }, 'Only these types are allowed .jpg, .jpeg, and .png')
        .refine((files) => {
            if (files[0] && files[0].size) {
                return files[0].size <= MAX_IMAGE_SIZE
            }
        }, `File size should be less than 5 MB.`),
})
