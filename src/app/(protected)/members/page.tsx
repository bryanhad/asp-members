import { Button } from '@/components/ui/button'
import Link from 'next/link'
import React from 'react'

export default function MembersPage() {
    return (
        <div className="space-y-4">
            <p>Memberspage</p>
            <Button asChild>
                <Link href="/members/add">Add Member</Link>
            </Button>
        </div>
    )
}
