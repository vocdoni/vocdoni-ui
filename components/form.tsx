import React, { ChangeEvent } from 'react'
import styled, { DefaultTheme } from 'styled-components'
import { HelpText } from './common/help-text'
import FileLoader from './FileLoader'

import { Input, Textarea } from './inputs'
import { SectionTitle } from './text'

type BaseForGroupProps = {
  title?: string
  label?: string
  helpText?: string
  id?: string
  name?: string
  placeholder?: string
  error?: string
  variant?: FormGroupVariant
}

type IInputFormGroupProps = {
  value?: string
  rows?: number
  type?: string
  onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onBlur?: (value: string) => void
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

export enum FormGroupVariant {
  Small = 'small',
  Regular = 'regular',
}

const FormGroupVariantStyle = {
  [FormGroupVariant.Small]: (theme: DefaultTheme) => `
    margin-bottom: 16px
  `,
  [FormGroupVariant.Regular]: (theme: DefaultTheme) => `
    margin-bottom: 32px
  `,
}

export const formGroupHOC = (InputField) => ({
  title,
  label,
  name,
  helpText,
  id,
  placeholder,
  value,
  type,
  rows,
  error,
  onChange,
  onBlur,
  variant = FormGroupVariant.Regular,
}: IInputFormGroupProps) => {
  const inputId = id || `input-${generateRandomId()}`

  return (
    <FormGroup variant={variant}>
      {title && <InputTitle>{title}</InputTitle>}
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
      {helpText && <HelpText text={helpText} />}
      <InputField
        id={inputId}
        rows={rows}
        wide
        placeholder={placeholder}
        type={type}
        name={name}
        value={value || ''}
        error={!!error}
        onChange={onChange}
        onBlur={onBlur}
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
  variant = FormGroupVariant.Regular,
}: FileFormGroupProps) => {
  const fileInputId = id || `file-${generateRandomId()}`

  return (
    <FormGroup variant={variant}>
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

const InputTitle = styled(SectionTitle)`
  font-size: 26px;
  font-weight: 400;
  color: ${({ theme }) => theme.blueText};
`

const InputLabel = styled.label`
  font-weight: 400;
  font-size: 13px;
  line-height: 1.6em;
`

const InputError = styled.p`
  color: ${({ theme }) => theme.danger};
  position: absolute;
  margin: 0 0 0 4px;
  bottom: -10px;
`

export const FormGroup = styled.div<{ variant: FormGroupVariant }>`
  position: relative;
  ${({ theme, variant }) =>
    FormGroupVariantStyle[variant || FormGroupVariant.Small](theme)}
`

export const Fieldset = styled.fieldset`
  border: none;
`
