'use server'

import { getUserByEmail, getUserById } from '@/data/user'
import { currentUser } from '@/lib/auth'
import { db } from '@/lib/db'
import { updateImage, uploadImage } from '@/lib/image-upload'
import { sendEmailVerificationEmail } from '@/lib/mail'
import { generateEmailVerificationToken } from '@/lib/tokens'
import { getCloudinaryPublicImageId } from '@/lib/utils'
import { SettingsSchemaBackend } from '@/schemas'
import bcrypt from 'bcryptjs'
import { revalidatePath } from 'next/cache'

export const profileAction = async (formData: FormData) => {
    const user = await currentUser()

    if (!user) {
        return { error: 'Unauthorized' }
    }

    const dbUser = await getUserById(user.id)

    if (!dbUser) {
        return { error: 'Unauthorized' }
    }

    const validatedFields = SettingsSchemaBackend.safeParse({
        name: formData.get('name'),
        profilePic: (formData.get('profilePic') as File | null) || undefined,
        role: formData.get('role'),
        email: formData.get('email'),
        password: formData.get('password') || undefined,
        newPassword: formData.get('newPassword') || undefined,
    })

    if (!validatedFields.success) {
        console.log(validatedFields.error)
        return { error: 'Invalid Fields!' }
    }

    const input = validatedFields.data

    if (input.email && input.email !== user.email) {
        //we only send the verification email if the entered new email is different thant he current one
        const existingUser = await getUserByEmail(input.email)

        if (existingUser && existingUser.id !== user.id) {
            //if the new email is used by other and the person is different that the user,
            return { error: 'Email already taken' }
        }

        const verificationToken = await generateEmailVerificationToken(
            input.email
        )

        await sendEmailVerificationEmail(
            verificationToken.email,
            verificationToken.token
        )

        return { success: 'Verification email sent. Please Check your email.' }
    }

    if (input.password && input.newPassword) {
        const passwordMatch = await bcrypt.compare(
            input.password,
            dbUser.password
        )

        if (!passwordMatch) {
            return { error: `Old password doesn't match!` }
        }

        const hashedPassword = await bcrypt.hash(input.newPassword, 10)

        input.password = hashedPassword //reasign the password so prisma would update it with the new hashed Password
        input.newPassword = undefined // so that prisma wouldn't input this field
    }

    let profilePicUrl: string | undefined

    if (input.profilePic) {
        const arrayBuffer = await input.profilePic.arrayBuffer()
        const buffer = new Uint8Array(arrayBuffer)

        // IF THE USER HAS A PROFILE PIC, update image on cloudinary!
        if (user.profilePic) {
            const publicImageId = getCloudinaryPublicImageId(user.profilePic)
            const { secure_url } = await updateImage(
                buffer,
                'user',
                publicImageId
            )
            profilePicUrl = secure_url
        } else {
            // ELSE, just create on cloudinary!
            const { secure_url } = await uploadImage(buffer, 'user')
            profilePicUrl = secure_url
        }
    }

    await db.user.update({
        where: { id: dbUser.id },
        data: { ...input, profilePic: profilePicUrl },
    })

    revalidatePath('/users')
    return { success: 'Profile Updated!' }
}
