'use client'

import LoadingButton from '@/components/loading-button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { AddPracticeSchema, EditPracticeSchema } from '@/schemas'
import dynamic from 'next/dynamic'
import { useMemo } from 'react'
import { UseFormReturn } from 'react-hook-form'
import * as z from 'zod'

type PracticeFormProps = {
    form: any
    onSubmit: (values: any) => Promise<void>
    loading: boolean
    buttonText: string
}

export const PracticeForm = ({
    onSubmit,
    buttonText,
    form,
    loading,
}: PracticeFormProps) => {
    //dynamic import so that blocknote editor would be imported on the client side!
    const TextEditor = useMemo(
        () => dynamic(() => import('@/components/text-editor'), { ssr: false }),
        []
    )

    return (
        <div>
            <Form {...form}>
                <form
                    className="space-y-6"
                    onSubmit={form.handleSubmit(onSubmit)}
                >
                    <div className="space-y-4">
                        <FormField
                            control={form.control}
                            name="name"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={loading}
                                            placeholder="Hukum Rimba"
                                            type="text"
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Practice Description</FormLabel>
                                    <FormControl>
                                        <TextEditor
                                            onChange={field.onChange}
                                            initialContent={form.watch(
                                                'content'
                                            )}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <LoadingButton isLoading={loading}>
                        {buttonText}
                    </LoadingButton>
                </form>
            </Form>
        </div>
    )
}
