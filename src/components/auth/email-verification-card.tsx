'use client'

import { useSearchParams } from 'next/navigation'
import { CardWrapper } from './card-wrapper'
import { BeatLoader } from 'react-spinners'
import { useCallback, useEffect, useState } from 'react'
import { verifyEmail } from '@/actions/verify-email'
import { FormError } from '../form-error'
import { FormSuccess } from '../form-success'

export const EmailVerificationCard = () => {
    const [error, setError] = useState<string | undefined>()
    const [success, setSuccess] = useState<string | undefined>()

    const searchParams = useSearchParams()
    const token = searchParams.get('token')

    const onSubmit = useCallback(async () => {
        if (success || error) return // if we already have success or error msg, just break the func

        if (!token) {
            setError('Token is missing!')
            return
        }
        try {
            const data = await verifyEmail(token)
            if (data.success) {
                setSuccess(data.success)
            }
            if (data.error) {
                setError(data.error)
            }
        } catch (err) {
            setError('Something went wrong!')
        }
    }, [token, success, error])

    useEffect(() => {
        onSubmit()
    }, [onSubmit])

    return (
        <CardWrapper
            headerLabel="Confirming your verification"
            backButtonLabel="Back to login"
            backButtonHref="/auth/login"
        >
            <div className="flex items-center justify-center">
                {!success && !error && <BeatLoader />}
                <FormSuccess message={success} />
                <FormError message={error} />
            </div>
        </CardWrapper>
    )
}
