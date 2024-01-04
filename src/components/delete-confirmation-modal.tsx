import React from 'react'
import { CardWrapper } from './auth/card-wrapper'
import { Button } from './ui/button'

export default function DeleteConfirmationModal() {
  return (
    <CardWrapper headerLabel='Are you sure?' backButtonLabel='cancel' backButtonHref='bruh' >
        <div className='flex items-center justify-center gap-4'>
            <Button>
                YES
            </Button>
        </div>
    </CardWrapper>
  )
}
