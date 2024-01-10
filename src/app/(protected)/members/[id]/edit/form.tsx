'use client'

import { EditMemberSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { Member, Position, Practice } from '@prisma/client'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import MemberForm from '../../_components/form'
import { editMember } from '@/actions/member'

type EditMemberFormProps = {
    member: {
        practices: Practice[]
    } & Member
    positions: Position[]
    practices: Practice[]
}

type EditMemberResponse =
    | {
          error: string
          success?: undefined
      }
    | {
          success: string
          error?: undefined
      }

export default function EditMemberForm({
    positions,
    member,
    practices,
}: EditMemberFormProps) {
    const router = useRouter()

    const [isPending, startTransition] = useTransition()

    const form = useForm<z.infer<typeof EditMemberSchema>>({
        resolver: zodResolver(EditMemberSchema),
        defaultValues: {
            name: member?.name || '',
            email: member?.email || '',
            picture: undefined,
            description: member?.description || undefined,
            positionSlug: member?.positionSlug || '',
            education: member?.education || [],
            organization: member?.organization || [],
            practices: member.practices.map((el) => el.id) || [],
            joinedSince: member.joinedSince || undefined,
        },
    })

    const onSubmit = async (values: z.infer<typeof EditMemberSchema>) => {
        startTransition(async () => {
            try {
                const formData = new FormData()

                Object.entries(values).forEach(([key, value]) => {
                    let input: File | string

                    if (value && value !== member[key]) {
                        if (key === 'picture' && values.picture) {
                            input = values.picture[0]
                        } else if (value instanceof Date) {
                            input = value.toString()
                        } else {
                            input =
                                typeof value === 'string'
                                    ? value
                                    : JSON.stringify(value)
                        }
                        formData.append(key, input)
                    }
                })
                formData.append('memberId', member.id)

                const { error, success } = await editMember(formData)

                if (success) {
                    toast.success(success)
                    router.push('/members')
                }
                if (error) {
                    toast.error(error)
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
            memberPicture={member.picture}
            practices={practices}
            onSubmit={onSubmit}
            loading={isPending}
            buttonText="Edit Member"
        />
    )
}
