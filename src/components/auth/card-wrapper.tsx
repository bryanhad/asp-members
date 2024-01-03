'use client'

import { Card, CardContent, CardFooter, CardHeader } from '../ui/card'
import { BackButton } from './back-button'
import { Header } from './header'

type CardWrapperProps = {
    children: React.ReactNode
    headerLabel: string
    backButtonLabel: string
    backButtonHref: string
}

export const CardWrapper = ({
    backButtonHref,
    backButtonLabel,
    children,
    headerLabel,
}: CardWrapperProps) => {
    return (
        <Card className="w-[400px] shadow-md">
            <CardHeader>
                <Header label={headerLabel} />
            </CardHeader>
            <CardContent>{children}</CardContent>
            <CardFooter>
                <BackButton href={backButtonHref} label={backButtonLabel} />
            </CardFooter>
        </Card>
    )
}
