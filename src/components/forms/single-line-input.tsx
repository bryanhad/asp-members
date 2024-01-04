import LoadingButton from '../loading-button'
import { Button } from '../ui/button'
import { Input, InputProps } from '../ui/input'

type SingleLineInputProps = {
    isLoading: boolean
} & React.InputHTMLAttributes<HTMLInputElement> &
    InputProps

export default function SingleLineInput({
    isLoading,
    ...props
}: SingleLineInputProps) {
    return (
        <div className="flex rounded-md focus-within:ring-offset-background focus-within:ring-1 focus-within:ring-ring/10 dark:focus-within:ring-ring/20 focus-within:ring-offset-1 group">
            <Input
                {...props}
                variant="onlyRoundLeft"
                className="ring-0"
                disabled={isLoading}
                placeholder="Konglomerat"
                type="text"
            />
            <Button
                size="lg"
                type="button"
                rounded="onlyRightMd"
                variant="single-line-submit-button"
                className='group-focus-within:border-none'
            >
                yeap
            </Button>
        </div>
    )
}
