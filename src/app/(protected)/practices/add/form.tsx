'use client'

import { addPractice } from '@/actions/practices'
import { AddPracticeSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { PracticeForm } from '../_components/form'

export default function AddPracticeForm() {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof AddPracticeSchema>>({
        resolver: zodResolver(AddPracticeSchema),
        defaultValues: {
            name: '',
            content: '',
        },
    })

    const onSubmit = async (values: z.infer<typeof AddPracticeSchema>) => {
        startTransition(async () => {
            const data = await addPractice(values)
            if (data.success) {
                router.push('/practices')
                toast.success(data.success)
            }
            if (data.error) {
                toast.error(data.error)
            }
        })
    }

    return (
        <PracticeForm
            form={{ ...form }}
            onSubmit={onSubmit}
            loading={isPending}
            buttonText="Add Practice"
        />
    )
}
