import { cn } from '@/lib/utils'
import LoadingButton from '../loading-button'
import { Button } from '../ui/button'
import { Input, InputProps } from '../ui/input'
import React from 'react'

export interface SingleLineInputProps
    extends React.InputHTMLAttributes<HTMLInputElement>, InputProps
 {
    isLoading: boolean
    buttonText: string
    cancelButtonText?: string
    onCancelClicked?: () => void
}

// interface SingleLineInputProps extends  {
//     isLoading: boolean
//     buttonText: string
//     cancelButtonText?: string
//     onCancelClicked?: () => void
// } & React.InputHTMLAttributes<HTMLInputElement> &
//     InputProps

    

const SingleLineInput = React.forwardRef<HTMLInputElement, SingleLineInputProps>(
    ({
    isLoading,
    cancelButtonText,
    onCancelClicked,
    buttonText,
    className,
    ...props
}, ref)  => {
    return (
        <div
            className={cn(
                'flex rounded-md focus-within:ring-offset-background focus-within:ring-1 focus-within:ring-ring/10 dark:focus-within:ring-ring/20 focus-within:ring-offset-1 group',
                className
            )}
        >
            <Input
                {...props}
                ref={ref}
                variant="onlyRoundLeft"
                className="ring-0"
                disabled={isLoading}
                type="text"
            />
            {cancelButtonText && (
                <Button
                    size="lg"
                    type="button"
                    rounded="noRounded"
                    variant="outline-y-only"
                    onClick={onCancelClicked}
                    disabled={isLoading}
                    className={'px-3 py-2'}
                >
                    {cancelButtonText}
                </Button>
            )}
            <LoadingButton
                isLoading={isLoading}
                size="lg"
                type="submit"
                rounded="onlyRightMd"
                variant="single-line-submit-button"
                className={cn({'px-3': cancelButtonText})}
            >
                {buttonText}
            </LoadingButton>
        </div>
    )
}
)
SingleLineInput.displayName = 'SingleLineInput'
export {SingleLineInput}