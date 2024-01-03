'use client'

import { Button, ButtonProps } from './ui/button'
import { RiLoader4Line } from 'react-icons/ri'

type LoadingButtonProps = {
    isLoading: boolean
} & ButtonProps

export default function LoadingButton({
    isLoading,
    ...props
}: LoadingButtonProps) {
    return (
        <Button disabled={isLoading} {...props}>
            {isLoading ? (
                <>
                    <RiLoader4Line className="mr-2 animate-spin text-lg" />
                    Loading
                </>
            ) : (
                <>{props.children}</>
            )}
        </Button>
    )
}
