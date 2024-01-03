import * as z from 'zod'

export const LoginSchema = z.object({
    email: z.string().email({ message: 'Email is required' }),
    password: z.string().min(1, { message: 'Password is required' }), //we shouldn't limit the login password legnth, cuz we may change it in the future right?
    // it is fair to put the limitation on the RegisterForm tho
})
