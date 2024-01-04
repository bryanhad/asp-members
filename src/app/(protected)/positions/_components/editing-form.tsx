'use client'

import { editPosition } from '@/actions/positions'
import SingleLineInput from '@/components/forms/single-line-input'
import { PositionsSchema } from '@/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
type EditingFormProps = {
    closeForm: () => void
    position: {
        name: string
        id: string
    }
}

export default function EditingForm({ closeForm, position }: EditingFormProps) {
    const form = useForm<z.infer<typeof PositionsSchema>>({
        resolver: zodResolver(PositionsSchema),
        defaultValues: {
            name: position.name,
        },
    })

    const [isPending, startTransition] = useTransition()

    async function onSubmit(values: z.infer<typeof PositionsSchema>) {
        startTransition(async () => {
            const data = await editPosition(values, position.id)
            if (data.error) {
                toast.error(data.error)
            }
            if (data.success) {
                toast.success(data.success)
                closeForm()
            }
        })
    }

    return (
        <Form {...form}>
            <form className="flex-[1] w-full" onSubmit={form.handleSubmit(onSubmit)}>
                <div className="space-y-4">
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormControl>
                                    <SingleLineInput
                                        buttonText="Save edit"
                                        isLoading={isPending}
                                        className="flex-[1]"
                                        cancelButtonText="cancel"
                                        onCancelClicked={closeForm}
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
            </form>
        </Form>
    )
}
