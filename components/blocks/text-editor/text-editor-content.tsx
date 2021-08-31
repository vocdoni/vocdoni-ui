import React from "react"
import styled from 'styled-components'
import { Editor, EditorContent } from "@tiptap/react"

interface ITextEditorContentProps {
  editor: Editor;
}

export const TextEditorContent = ({ editor }: ITextEditorContentProps) => {
  return (
    <TextEditorContentWrapper>
      <EditorContent editor={editor} /> 
    </TextEditorContentWrapper>
  );
};

const TextEditorContentWrapper = styled.div`
  padding: 0 20px;
  max-height: 300px;
  overflow: scroll;

  & > div,
  & .ProseMirror {
    min-height: 100px;
    height: 100%;
    border: none;

    outline: none;

    & blockquote {
      border-left: 1px solid #e0e0e0;
      padding-left: 20px;
      margin-left: 0px;
    }

    & h1,
    & h2 {
      font-weight: 500;
    }

    & h1 {
      font-size: 28px;
    }

    & h2 {
      font-size: 20px;
    } 
  }
`
