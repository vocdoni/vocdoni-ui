import React from 'react';
import { useEditor } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import Underline from '@tiptap/extension-underline'
import Link from '@tiptap/extension-link'
import sanitizeHtml from 'sanitize-html';


import { TextEditorContent } from './text-editor-content';
import { TextEditorMenu } from './text-editor-menu';
import styled from 'styled-components';

interface TextEditorProps {
  onChange?: (content: string) => void;
  content?: string;
  markdown?: boolean;
  deps?: any[];
}


export const TextEditor = ({ onChange, content, markdown, deps }: TextEditorProps) => {

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
    parseOptions: {
      preserveWhitespace: false,
    },
    onUpdate: function ({ editor })  {
      if (markdown) {
        onChange(sanitizeHtml(editor.getHTML()))
      } else {
        onChange(sanitizeHtml(editor.getHTML()));
      }
    }
  }, deps)

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
