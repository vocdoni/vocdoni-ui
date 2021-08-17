import React from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"
import Close from "remixicon/icons/System/close-line.svg"

import { Input } from "@components/elements/inputs"
import { Button } from "@components/elements/button"



interface ITextEditorContentProps {
  onChange: (value: string) => void
  onApply: (value: string) => void
  onClose: () => void
  value: string
}

export const TextEditorLinkMenu = ({ value, onChange, onApply, onClose }: ITextEditorContentProps) => {
  const { i18n } = useTranslation()

  return (
    <LinkMenuWrapper>
      <LinkText>{i18n.t('text_editor.link')}</LinkText>
      <CloseButton onClick={onClose}>
        <Close />
      </CloseButton>

      <InputWrapper>
        <Input value={value} onChange={(event) => onChange(event.target.value)} />
        <Button positive onClick={() => onApply(value)}>{i18n.t('text_editor.apply')}</Button>
      </InputWrapper>
    </LinkMenuWrapper>
  )
}

const CloseButton = styled.div`
  position: absolute;
  top: 6px;
  right: 6px;
  width: 22px;
  height: 22px;
  cursor: pointer;
`

const LinkText = styled.span`
  font-size: 1.2em;
  color: #333;
`

const InputWrapper = styled.div`
  display: flex;
  max-height: 41px;
  margin-top: 4px;

  & > input {
    display: inline-block;
    margin: 0;
    border-radius: 8px 0 0 8px;
  }

  & > div {
    border-radius: 0 8px 8px 0;
  }
`

const LinkMenuWrapper = styled.div`
  position: absolute;
  padding: 8px;
  background-color: rgb(255, 255, 255);
  border-color: rgb(218, 220, 224);
  border-radius: 8px;
  box-shadow: rgb(60 64 67 / 15%) 0px 1px 3px 1px;
  color: rgb(60, 64, 67);
  z-index: 2;
`