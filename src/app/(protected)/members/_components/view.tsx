'use client'

import { Button } from '@/components/ui/button'
import { Member, Position } from '@prisma/client'
import Image from 'next/image'
import Link from 'next/link'
import { PiPencilSimpleLine } from 'react-icons/pi'

type AddMemberFormProps = {
    member: Member & { position: Position }
}

export default function MemberView({ member }: AddMemberFormProps) {
    return (
        <div className="">
            <div className="flex items-center mb-4 gap-5">
                <h2 className="text-xl ">{member.name}</h2>
                <Button asChild variant={'ghost'}>
                    <Link href={`/members/${member.id}/edit`} >
                        <PiPencilSimpleLine />
                    </Link>
                </Button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-9">
                <div className="flex flex-col sm:flex-row gap-4 items-center">
                    <div className="rounded-lg overflow-hidden relative w-32 min-w-32 h-32 border">
                        <Image
                            className="object-cover"
                            alt=""
                            src={member.picture}
                            fill
                            priority
                        />
                    </div>
                </div>

                <TextShowCase
                    label="Description"
                    text={member.description || ''}
                />
                <TextShowCase label="Email" text={member.email} />

                <TextShowCase label="Position" text={member.position.name} />

                <ListShowCase list={member.education} label="Education" />
                <ListShowCase
                    list={member.organization}
                    label="Organizations"
                />
                <ListShowCase list={member.practices} label="Practice" />
            </div>
        </div>
    )
}

type TextShowCaseProps = {
    text: string
    label: string
}

function TextShowCase({ text, label }: TextShowCaseProps) {
    return (
        <div className="border rounded-md text-sm">
            <p className="py-2 px-3">{label}</p>
            <hr />
            <p className="py-2 px-3">{text}</p>
        </div>
    )
}
type ListShowCaseProps = {
    list: string[]
    label: string
}

function ListShowCase({ list, label }: ListShowCaseProps) {
    return (
        <div className="border rounded-md text-sm">
            <p className="py-2 px-3">{label}</p>
            <hr />
            {list.length ? (
                <ul className="list-disc ml-5 py-2 px-3">
                    {list.map((practice) => (
                        <li key={practice} className="my-1">
                            {practice}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>not defined</p>
            )}
        </div>
    )
}
