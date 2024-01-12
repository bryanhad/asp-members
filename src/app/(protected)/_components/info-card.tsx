import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

type InfoCardProps = {
    title: string
    infoNumber: number
    icon: JSX.Element
    className?:string
}

export const InfoCard = ({ title, infoNumber, icon, className }: InfoCardProps) => {
    return (
        <Card className="p-4">
            <div className="flex items-center gap-4">
                <div className={cn("p-2 rounded-md bg-secondary text-3xl text-white", className)}>
                    {icon}
                </div>
                <div className="">
                    <p>{title}</p>
                    <p className="text-2xl">{infoNumber}</p>
                </div>
            </div>
        </Card>
    )
}
