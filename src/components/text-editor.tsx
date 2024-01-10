'use client'

import { useTheme } from 'next-themes'
import { Block, BlockNoteEditor, PartialBlock } from '@blocknote/core'

import { BlockNoteView, useBlockNote } from '@blocknote/react'
import '@blocknote/core/style.css'
import { uploadImageToCloudinary } from '@/actions/image'
import { useEffect } from 'react'

type TextEditorProps = {
    onChange: (value: string) => void
    initialContent?: string
    editable?: boolean
}

export default function TextEditor({
    onChange,
    editable,
    initialContent,
}: TextEditorProps) {
    const { resolvedTheme } = useTheme()

    async function handleUpload(file: File) {
        const formData = new FormData()
        formData.append('file', file)
        const url = await uploadImageToCloudinary(formData, 'practice/content')
        return url
    }

    const editor: BlockNoteEditor = useBlockNote({
        editable,
        // initialContent: initialContent
        //     ? (JSON.parse(initialContent) as PartialBlock<{}, {}, {}>[])
        //     : undefined,
        onEditorContentChange: async (editor) => {
            // Converts the editor's contents from Block objects to HTML and saves
            // them.
            const saveBlocksAsHTML = async () => {
                const html: string = await editor.blocksToHTMLLossy(
                    editor.topLevelBlocks
                )
                console.log(html)
                onChange(html)
            }
            saveBlocksAsHTML()
            // onChange(JSON.stringify(editor.topLevelBlocks, null, 2))
        },
        uploadFile: handleUpload,
    })

    useEffect(() => {
        if (editor && initialContent) {
          // Whenever the current HTML content changes, converts it to an array of
          // Block objects and replaces the editor's content with them.
          const getBlocks = async () => {
            const blocks = await editor.tryParseHTMLToBlocks(initialContent);
            editor.replaceBlocks(editor.topLevelBlocks, blocks);
          };
          getBlocks();
        }
      }, []);

    return (
        <div>
            <BlockNoteView
                editor={editor}
                theme={resolvedTheme === 'dark' ? 'dark' : 'light'}
            />
        </div>
    )
}
