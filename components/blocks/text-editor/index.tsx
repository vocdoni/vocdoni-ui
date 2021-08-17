import React from 'react';
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import TurndownService from 'turndown'
import sanitizeHtml from 'sanitize-html';


import { TextEditorContent } from './text-editor-content';
import { TextEditorMenu } from './text-editor-menu';
import styled from 'styled-components';
import { useRef } from 'react';

interface TextEditorProps {
  onChange?: (content: string) => void;
  content?: string;
  markdown?: boolean;
}


export const TextEditor = ({ onChange, content, markdown }: TextEditorProps) => {
  const turndownService = useRef(new TurndownService())

  const editor = useEditor({
    extensions: [
      StarterKit,
      Underline,
      Link.extend({
        ...Link.options,
        openOnClick: false,
      })
    ],
    content,
    onUpdate: ({ editor }) => {
      if (markdown) {
        onChange(turndownService.current.turndown(editor.getHTML()))
      } else {
        onChange(sanitizeHtml(editor.getHTML()));
      }
    }

  })

  return (
    <TextEditorContentWrapper>
      {editor && <TextEditorMenu editor={editor} />}
      {editor && <TextEditorContent editor={editor} />}
    </TextEditorContentWrapper>
  )
}

const TextEditorContentWrapper = styled.div`
  border: solid 1px ${({ theme }) => theme.lightBorder};
  border-radius: 8px;
`