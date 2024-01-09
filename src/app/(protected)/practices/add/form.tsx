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
import { CookingPot } from 'lucide-react'

export default function AddPracticeForm() {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof AddPracticeSchema>>({
        resolver: zodResolver(AddPracticeSchema),
        defaultValues: {
            name: '',
            content: '',
            icon: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof AddPracticeSchema>) => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            let input: File | string
            if (key === 'icon' && values.icon) {
                input = values.icon[0]
            } else {
                input =
                    typeof value === 'string' ? value : JSON.stringify(value)
            }
            formData.append(key, input)
        })

        startTransition(async () => {
            const { error, success } = await addPractice(formData)

            if (success) {
                router.push('/practices')
                toast.success(success)
            }
            if (error) {
                toast.error(error)
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
