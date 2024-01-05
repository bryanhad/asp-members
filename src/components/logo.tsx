import { cn } from "@/lib/utils"
import { Poppins } from "next/font/google"
import Image from "next/image"

type LogoProps = {
    className?:string
}

const font = Poppins({
    subsets: ['latin'],
    weight: ['400', '600']
})

export const Logo = ({className}:LogoProps) => {
    return (
        <div className={cn("flex items-end gap-1", className)}>
            <Image
                alt="logo"
                src='/logo.png'
                height='30'
                width='30'
            />
            <p className={cn('font-semibold text-muted-foreground ', font.className)}>
                ASP-admin
            </p>
        </div>
    )

}