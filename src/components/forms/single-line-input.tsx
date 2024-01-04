import { cn } from '@/lib/utils'
import LoadingButton from '../loading-button'
import { Button } from '../ui/button'
import { Input, InputProps } from '../ui/input'

type SingleLineInputProps = {
    isLoading: boolean
    buttonText: string
    cancelButtonText?: string
    onCancelClicked?: () => void
} & React.InputHTMLAttributes<HTMLInputElement> &
    InputProps

export default function SingleLineInput({
    isLoading,
    cancelButtonText,
    onCancelClicked,
    buttonText,
    className,
    ...props
}: SingleLineInputProps) {
    return (
        <div
            className={cn(
                'flex rounded-md focus-within:ring-offset-background focus-within:ring-1 focus-within:ring-ring/10 dark:focus-within:ring-ring/20 focus-within:ring-offset-1 group',
                className
            )}
        >
            <Input
                {...props}
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
                    variant="default"
                    onClick={onCancelClicked}
                    disabled={isLoading}
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
                className="group-focus-within:border-none"
            >
                {buttonText}
            </LoadingButton>
        </div>
    )
}
