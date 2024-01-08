'use client'

import { useTheme } from 'next-themes'
import { BlockNoteEditor, PartialBlock } from '@blocknote/core'

import { BlockNoteView, useBlockNote } from '@blocknote/react'
import '@blocknote/core/style.css'
import { uploadImageToCloudinary } from '@/actions/image'

type TextEditorProps = {
    onChange: (value: string) => void
    initialContent?: string
    editable?: boolean
}

export default function TextEditor ({
    onChange,
    editable,
    initialContent,
}: TextEditorProps) {
    const { resolvedTheme } = useTheme()

    async function handleUpload(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        const url = await uploadImageToCloudinary(formData)
        return url
    }

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        initialContent: 
            initialContent 
                ? JSON.parse(initialContent) as PartialBlock<{},{},{}>[]
                : undefined,
        onEditorContentChange: (editor) => {
            onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
        },
        uploadFile: handleUpload,
    })


    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    )
}
