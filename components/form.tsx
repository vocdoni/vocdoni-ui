import React, { ChangeEvent, ReactNode, useState } from 'react'
import styled from 'styled-components'
import FileLoader from './FileLoader'

import { Input, Textarea } from './inputs'
import { SectionTitle } from './text'

type BaseForGroupProps = {
  title?: string
  label?: string
  id?: string
  name?: string
  placeholder?: string
  error?: string
}

type IInputFormGroupProps = {
  value?: string
  rows?: number
  onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
} & BaseForGroupProps

type FileFormGroupProps = {
  file: File
  url: string
  accept: string
  onChange: (value: string) => void
  onSelect: (value: File) => void
} & BaseForGroupProps

const RANDOM_LENGTH = 10

const generateRandomId = () =>
  (Math.random() * Math.pow(10, RANDOM_LENGTH)).toFixed(0)

export const formGroupHOC = (InputField) => ({
  title,
  label,
  name,
  id,
  placeholder,
  value,
  rows,
  error,
  onChange,
}: IInputFormGroupProps) => {
  const inputId = id || `input-${generateRandomId()}`

  return (
    <FormGroup>
      {title && <InputTitle>{title}</InputTitle>}
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}

      <InputField
        id={inputId}
        rows={rows}
        wide
        placeholder={placeholder}
        name={name}
        value={value}
        onChange={onChange}
      />
      {error && <InputError>{error}</InputError>}
    </FormGroup>
  )
}

export const InputFormGroup = formGroupHOC(Input)
export const TextareaFormGroup = formGroupHOC(Textarea)

export const FileLoaderFormGroup = ({
  title,
  label,
  id,
  file,
  accept,
  url,
  error,
  onChange,
  onSelect,
}: FileFormGroupProps) => {
  const fileInputId = id || `file-${generateRandomId()}`

  return (
    <FormGroup>
      {title && <InputTitle>{title}</InputTitle>}
      {label && <InputLabel>{label}</InputLabel>}

      <FileLoader
        onSelect={onSelect}
        onChange={onChange}
        file={file}
        url={url}
        accept={accept}
      />
      {error && <InputError>{error}</InputError>}
    </FormGroup>
  )
}

const InputTitle = styled(SectionTitle)``

const InputLabel = styled.label`
  font-weight: 400;
  font-size: 18px;
  line-height: 1.3em;
`

const InputError = styled.p`
  color: ${({theme}) => theme.danger}
`

export const FormGroup = styled.div<{ marginBottom?: number }>`
  margin-bottom: ${({ marginBottom }) =>
    marginBottom ? marginBottom : '32px'};
`

export const Fieldset = styled.fieldset`
  border: none;
`
