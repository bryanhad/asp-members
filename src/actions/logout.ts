'use server'

import { signOut } from "@/auth"

export const logout = async() => {
    // you can do some server stuff before logging out
    // this is just an example
    await signOut()
}