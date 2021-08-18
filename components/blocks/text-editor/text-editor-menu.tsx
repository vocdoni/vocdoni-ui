import React, { useState } from "react";
import styled from "styled-components";
import { Editor } from "@tiptap/react";


import Italic from "remixicon/icons/Editor/italic.svg"
import Bold from "remixicon/icons/Editor/bold.svg"
import Underline from "remixicon/icons/Editor/underline.svg"
import ListUnordered from "remixicon/icons/Editor/list-unordered.svg"
import ListOrdered from "remixicon/icons/Editor/list-ordered.svg"
import H1 from "remixicon/icons/Editor/h-1.svg"
import H2 from "remixicon/icons/Editor/h-2.svg"
import Quotes from "remixicon/icons/Editor/double-quotes-l.svg"
import Link from "remixicon/icons/Editor/link.svg"
import Undo from "remixicon/icons/System/arrow-go-back-line.svg"
import Redo from "remixicon/icons/System/arrow-go-forward-line.svg"

import { ActionButton } from "./action-button";
import { TextEditorLinkMenu } from "./text-editor-link-menu";

interface TextEditorMenuProps {
  editor: Editor;
}

export enum EditorActions {
  Italic = 'toggleItalic',
  Bold = 'toggleBold',
  Underline = 'toggleUnderline',
  ListUnordered = 'toggleBulletList',
  ListOrdered = 'toggleOrderedList',
  Blockquote = 'toggleBlockquote',
  Link = 'toggleLink',
  h1 = 'toggleHeading',
  h2 = 'toggleHeading',
  Undo = 'undo',
  Redo = 'redo',
}

export const TextEditorMenu = ({ editor }: TextEditorMenuProps) => {
  const [activeMenuAction, setActiveMenuAction] = useState<EditorActions>()
  const [linkValue, setLinkValue] = useState<string>()
  const [showLinkMenu, setShowLinkMenu] = useState<boolean>(false)

  const handleActionButton = (action, optionalArgs) => {
    if (editor.commands[action]) {
      editor
        .chain()
        .focus()[action]
        .apply(this, optionalArgs)
        .run()

      if (action === activeMenuAction) {
        setActiveMenuAction(null)
      } else {
        setActiveMenuAction(action)
      }
    }
  }

  const handleLinkButton = (action) => {
    setLinkValue('')

    if (editor.isActive('link')) {
      editor.chain().focus().unsetLink().run()
    } else {
      setShowLinkMenu(true)
    }
  }

  const handleCloseLinkMenu = () => {
    setShowLinkMenu(false)

    editor
      .chain()
      .focus()
      .extendMarkRange('link')
  }

  const handleApplyLinkMenu = (url) => {
    editor
      .chain()
      .focus()
      .extendMarkRange('link')
      .setLink({
        href: url,
        target: '_blank',
      })
      .run()
  }

  return (
    <TextEditorMenuWrapper>
      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Italic}
          active={editor.isActive('italic')}
        ><Italic /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Bold}
          active={editor.isActive('bold')}
        ><Bold /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Underline}
          active={editor.isActive('underline')}
        ><Underline /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleLinkButton}
          action={EditorActions.Link}
          active={editor.isActive('link')}
        ><Link /></ActionButton>

        {showLinkMenu &&
          <TextEditorLinkMenu
            value={linkValue}
            onChange={(value) => setLinkValue(value)}
            onClose={handleCloseLinkMenu}
            onApply={handleApplyLinkMenu}
          />
        }
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.ListOrdered}
          active={editor.isActive('orderedList')}
        ><ListOrdered /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.ListUnordered}
          active={editor.isActive('bulletList')}
        ><ListUnordered /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          optionalArgs={[{ level: 1 }]}
          action={EditorActions.h1}
          active={editor.isActive('heading', { level: 1 })}
        ><H1 /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          optionalArgs={[{ level: 2 }]}
          action={EditorActions.h2}
          active={editor.isActive('heading', { level: 2 })}
        ><H2 /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Blockquote}
          active={editor.isActive('blockquote')}
        ><Quotes /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Undo}
        ><Undo /></ActionButton>
      </ButtonContainer>

      <ButtonContainer>
        <ActionButton
          onClick={handleActionButton}
          action={EditorActions.Redo}
        ><Redo /></ActionButton>
      </ButtonContainer>
    </TextEditorMenuWrapper>

  )
}

const ButtonContainer = styled.div`
  margin-right: 10px;
  display: inline-block;
  position: relative;
`

const TextEditorMenuWrapper = styled.div`
  padding: 4px 10px;
  border-bottom: solid 1px ${({ theme }) => theme.lightBorder};
`