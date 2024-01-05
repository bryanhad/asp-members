'use client'
import { cn } from '@/lib/utils'
import { ChangeEvent, KeyboardEvent, useRef, useState } from 'react'
import { FiTrash } from 'react-icons/fi'
import { buttonVariants } from '../ui/button'
import { FormControl, FormItem, FormLabel } from '../ui/form'

type MultiInputProps = {
    currentValue: string[] | undefined
    setValue: (input: string[]) => void
} & React.InputHTMLAttributes<HTMLInputElement>

export default function MultiInput({
    setValue,
    currentValue,
    ...props
}: MultiInputProps) {
    const ref = useRef<HTMLInputElement>(null)

    const [input, setInput] = useState<string>('')

    function handleChange(e: ChangeEvent<HTMLInputElement>) {
        setInput(e.target.value)
    }

    function handleEnter(e: KeyboardEvent<HTMLInputElement>) {
        if (e.key === 'Enter') {
            e.preventDefault()
            add()
        }
    }

    function handleClick(e: React.MouseEvent<HTMLElement>) {
        add()
        if (ref.current) {
            ref.current.focus()
        }
    }

    function add() {
        if (currentValue) {
            if (!input || currentValue.includes(input)) return
            setValue([...currentValue, input])
            setInput('')
        }
    }

    function handleDelete(el: string) {
        if (currentValue) {
            setValue([...currentValue.filter((value) => value !== el)])
        }
    }

    return (
        <div className={`flex flex-col`}>
            <FormItem>
                <FormLabel htmlFor={props.name} className="flex">
                    <>
                        <span className="capitalize">{props.name}</span>
                        <span className="ml-2 italic text-muted-foreground/60">
                            (Press enter to submit)
                        </span>
                    </>
                </FormLabel>
                <FormControl>
                    <div className="group flex rounded-lg border border-focus ring-offset-background focus-within:ring-2 focus-within:ring-ring/10 focus-within:ring-offset-2">
                        <input
                            {...props}
                            size={1}
                            ref={ref}
                            className="text-input-color text-sm flex-1 rounded-l-lg bg-transparent px-3 py-2 focus:outline-none"
                            type="text"
                            id={props.name}
                            value={input}
                            onChange={handleChange}
                            onKeyDown={handleEnter}
                        />
                        <button
                            onClick={handleClick}
                            className="rounded-r-lg bg-blue-600 px-6 text-white text-sm"
                            type="button"
                        >
                            ADD
                        </button>
                    </div>
                </FormControl>
            </FormItem>
            {currentValue && (
                <ul className="mt-3 flex flex-wrap gap-3">
                    {currentValue.map((el, i) => (
                        <li
                            key={i}
                            onClick={() => handleDelete(el)}
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
                            {el}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )
}
