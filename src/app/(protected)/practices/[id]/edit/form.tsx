'use client'

import { editPractice } from '@/actions/practices'
import { EditMemberSchema, EditPracticeSchema } from '@/schemas'
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
        },
    })

    const onSubmit = async (values: z.infer<typeof EditMemberSchema>) => {
        const nameFieldIsDirty = form.formState.dirtyFields.name
        startTransition(async () => {
            try {
                const data = await editPractice(
                    values,
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
        />
    )
}
