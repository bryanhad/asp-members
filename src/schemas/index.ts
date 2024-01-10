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

const MAX_IMAGE_SIZE = 500_880 // 5 MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/jpg']

// Form Schema Validation
export const uploadImageSchema = z
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
    }, `File size should be less than 5 MB.`)

const MemberNameSchema = z
    .string()
    .min(4, { message: 'Minimum 4 characters required' })
const MemberEmailSchema = z.string().email({ message: 'Email is required' })
const MemberPositionSchema = z
    .string()
    .min(4, { message: 'Please select one of the positions' })

export const AddMemberSchema = z.object({
    name: MemberNameSchema,
    email: MemberEmailSchema,
    picture: uploadImageSchema,
    description: z.optional(
        z.string().min(10, { message: 'Minimum 10 characters required' })
    ),
    education: z.optional(z.array(z.string())),
    organization: z.optional(z.array(z.string())),
    practices: z.optional(z.array(z.string())),
    positionSlug: MemberPositionSchema,
    joinedSince: z.optional(z.date()),
})

export const AddMemberSchemaBackend = AddMemberSchema.extend({
    picture: z.custom<File>(
        (val) => val instanceof File,
        'Picture must be a file type'
    ),
})

export const EditMemberSchema = AddMemberSchema.extend({
    picture: z.optional(uploadImageSchema),
})

export const EditMemberSchemaBackend = EditMemberSchema.extend({
    memberId: z.string(),
    name: z.optional(MemberNameSchema),
    email: z.optional(MemberEmailSchema),
    positionSlug: z.optional(MemberPositionSchema),
    picture: z.optional(
        z.custom<File>(
            (val) => val instanceof File,
            'Picture must be a file type'
        )
    ),
})

export const AddPracticeSchema = z.object({
    name: z
        .string()
        .min(4, { message: 'Practice name must be atleast 4 characters long' }),
    icon: uploadImageSchema,
    picture: uploadImageSchema,
    content: z
        .string()
        .min(1, { message: 'Please write a description for this practice' }),
})
export const AddPracticeSchemaBackend = AddPracticeSchema.extend({
    icon: z.custom<File>(
        (val) => val instanceof File,
        'Icon must be a file type'
    ),
    picture: z.custom<File>(
        (val) => val instanceof File,
        'Picture must be a file type'
    ),
})

export const EditPracticeSchema = AddPracticeSchema.extend({
    icon: z.optional(uploadImageSchema),
    picture: z.optional(uploadImageSchema),
})
export const EditPracticeSchemaBackend = AddPracticeSchema.extend({
    icon: z.optional(
        z.custom<File>((val) => val instanceof File, 'Icon must be a file type')
    ),
    picture: z.optional(
        z.custom<File>(
            (val) => val instanceof File,
            'Picture must be a file type'
        )
    ),
})

export const AddBlogSchema = z.object({
    title: z.string().min(5, { message: 'Minimum 5 characters required' }),
    content: z.string().min(10, { message: 'Minimum 10 characters required' }),
    picture: uploadImageSchema,
    categorySlug: z
        .string()
        .min(4, { message: 'Please select one of the category' }),
})

export const AddBlogSchemaBackend = AddBlogSchema.extend({
    picture: z.custom<File>(
        (val) => val instanceof File,
        'Picture must be a file type'
    ),
})

export const EditBlogSchema = AddBlogSchema.extend({
    picture: z.optional(uploadImageSchema),
})
export const EditBlogSchemaBackend = AddBlogSchema.extend({
    picture: z.optional(
        z.custom<File>(
            (val) => val instanceof File,
            'Picture must be a file type'
        )
    ),
})
