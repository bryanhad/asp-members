'use client'

import { cn } from "@/lib/utils"
import { usePathname } from "next/navigation"

type PageTitleProps = {
  className?:string
}

export default function PageTitle({className}:PageTitleProps) {
    const pathname = usePathname()

    const title = pathname.split('/')[1]
  return (
    <h1 className={cn("font-bold text-4xl capitalize", className)}>{title}</h1>
  )
}
