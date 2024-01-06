'use client'

import { AddMemberSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Member, Position } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import MemberForm from '../_components/form'

type AddMemberFormProps = {
    member?: Member
    positions: Position[]
}

type AddMemberResponse =
    | {
          error: string
          success?: undefined
      }
    | {
          success: string
          error?: undefined
      }

export default function AddMemberForm({
    positions,
    member,
}: AddMemberFormProps) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof AddMemberSchema>>({
        resolver: zodResolver(AddMemberSchema),
        defaultValues: {
            name: member?.name || '',
            email: member?.email || '',
            picture: undefined,
            description: member?.description || undefined,
            positionId: member?.positionId || '',
            education: member?.education || [],
            organization: member?.organization || [],
            practices: member?.practices || [],
            // joinedSince: undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof AddMemberSchema>) => {
        startTransition(async () => {
            try {
                const formData = new FormData()

                Object.entries(values).forEach(([key, value]) => {
                    let input: File | string
                    if (value !== undefined) {
                        if (key === 'picture' && values.picture) {
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

                const data = await fetch('/api/admin/member', {
                    method: 'POST',
                    body: formData,
                })
                const res: AddMemberResponse = await data.json()

                if (res.success) {
                    toast.success(res.success)
                    router.push('/members')
                }
                if (res.error) {
                    toast.error(res.error)
                }
            } catch (err) {
                console.log(err)
            }
        })
    }

    return (
        <MemberForm
            form={{ ...form }}
            positions={positions}
            member={member}
            onSubmit={onSubmit}
            loading={isPending}
        />
    )
}
