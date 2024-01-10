'use client'

import { editPractice } from '@/actions/practices'
import { EditPracticeSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Practice } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import { PracticeForm } from '../../_components/form'

type EditPracticeFormProps = {
    practice: Practice
}

export default function EditPracticeForm({ practice }: EditPracticeFormProps) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditPracticeSchema>>({
        resolver: zodResolver(EditPracticeSchema),
        defaultValues: {
            name: practice.name,
            content: practice.content,
            icon: undefined,
            picture: undefined
        },
    })

    const onSubmit = async (values: z.infer<typeof EditPracticeSchema>) => {
        const formData = new FormData()

        Object.entries(values).forEach(([key, value]) => {
            if (value) {
                let input: File | string
                if (key === 'icon' && values.icon) {
                    input = values.icon[0]
                } else if (key === 'picture' && values.picture) {
                    input = values.picture[0]
                } else {
                    input =
                        typeof value === 'string'
                            ? value
                            : JSON.stringify(value)
                }
                formData.append(key, input)
            }
        })

        const nameFieldIsDirty = form.formState.dirtyFields.name
        startTransition(async () => {
            try {
                const data = await editPractice(
                    formData,
                    practice.id,
                    nameFieldIsDirty
                )
                if (data.success) {
                    router.push('/practices')
                    toast.success(data.success)
                }
                if (data.error) {
                    toast.error(data.error)
                }
            } catch (err) {
                console.log(err)
            }
        })
    }

    return (
        <PracticeForm
            form={{ ...form }}
            onSubmit={onSubmit}
            loading={isPending}
            buttonText="Edit Practice"
            iconUrl={practice.icon}
            pictureUrl={practice.picture}
        />
    )
}
