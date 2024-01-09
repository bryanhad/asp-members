'use client'

import { BlockNoteEditor, PartialBlock } from '@blocknote/core'
import { useTheme } from 'next-themes'

import '@blocknote/core/style.css'
import { BlockNoteView, useBlockNote } from '@blocknote/react'

type ViewBlockNoteProps = {
    defaultValue: string
}

export default function ViewBlockNote({ defaultValue }: ViewBlockNoteProps) {
    const { resolvedTheme } = useTheme()

    const editor: BlockNoteEditor = useBlockNote({
        editable: false,
        initialContent: JSON.parse(defaultValue) as PartialBlock<{}, {}, {}>[],
    })

    return (
        <BlockNoteView
            editor={editor}
            theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
        />
    )
}
