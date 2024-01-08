'use client'
import { cn } from '@/lib/utils'
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { buttonVariants } from '../ui/button'
import { FormControl, FormItem, FormLabel } from '../ui/form'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'

type MultiSelectInputProps = {
    currentValue: string[] | undefined
    setValue: (input: string[]) => void
    items: { name: string; id: string }[]
    disabled: boolean
    name: string
}

export default function MultiSelectInput({
    setValue,
    currentValue,
    items,
    disabled,
    name,
}: MultiSelectInputProps) {
    const ref = useRef<HTMLInputElement>(null)
    console.log(currentValue)

    function handleEnter(input: string) {
        if (currentValue) {
            console.log(currentValue)
            if (currentValue.includes(input)) return
            setValue([...currentValue, input])
        }
    }

    function handleDelete(id: string) {
        if (Array.isArray(currentValue)) {
            setValue([...currentValue.filter((value) => value !== id)])
        }
    }

    return (
        <div className={`flex flex-col`}>
            <FormItem>
                <FormLabel htmlFor={name} className="flex">
                    <span className="capitalize">{name}</span>
                </FormLabel>
                <FormControl>
                    <div className="group flex rounded-lg border border-focus ring-offset-background focus-within:ring-2 focus-within:ring-ring/10 focus-within:ring-offset-2">
                        <Select disabled={disabled} onValueChange={handleEnter}>
                            <FormControl>
                                <SelectTrigger id={name}>
                                    <SelectValue placeholder="Select a position" />
                                </SelectTrigger>
                            </FormControl>
                            <SelectContent className="max-h-[200px]">
                                {items.map((item) => (
                                    <SelectItem key={item.id} value={item.id}>
                                        {item.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </FormControl>
            </FormItem>
            {currentValue && (
                <ul className="mt-3 flex flex-wrap gap-3">
                    {currentValue.map((id, i) => (
                        <li
                            key={i}
                            onClick={() => handleDelete(id)}
                            className={cn(
                                'flex max-w-max cursor-pointer select-none items-center gap-2 rounded-full border border-focus py-1 pl-2 pr-4 dark:border-focus-dark',
                                buttonVariants({
                                    variant: 'ghost',
                                    size: 'sm',
                                    rounded: 'full',
                                })
                            )}
                        >
                            <FiTrash />
                            {items.find((el) => el.id === id)?.name}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
