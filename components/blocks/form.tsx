import { ChangeEvent, forwardRef, KeyboardEvent, ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { DefaultTheme } from 'styled-components'

import FileLoader from './FileLoader'
import { HelpText } from './help-text'

import { Input, InputPassword, ISelectOption, Select, Textarea } from '../elements/inputs'
import { SectionTitle } from '../elements/text'

type BaseForGroupProps = {
  title?: string
  label?: string
  helpText?: string
  id?: string
  name?: string
  placeholder?: string
  info?: string | ReactNode
  error?: string
  success?: string | ReactNode
  editButton?: boolean
  variant?: FormGroupVariant
}

type IInputFormGroupProps = {
  value?: string
  rows?: number
  type?: string
  onChange: (value: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void
  onKeyUp?: (e: KeyboardEvent<HTMLInputElement>) => void
  onBlur?: (value: string) => void
} & BaseForGroupProps

type ISelectFromGroupProps = {
  value?: ISelectOption
  options?: ISelectOption[]
  onChange: (value: ISelectOption) => void
} & BaseForGroupProps

type FileFormGroupProps = {
  file: File
  url: string
  accept?: string
  maxMbSize?: number
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

export const formGroupHOC = (InputField) =>
  forwardRef<HTMLDivElement, IInputFormGroupProps>(
    (
      {
        title,
        label,
        name,
        helpText,
        id,
        placeholder,
        value,
        type,
        rows,
        info,
        error,
        success,
        editButton,
        onChange,
        onKeyUp,
        onBlur,
        variant = FormGroupVariant.Regular,
      },
      ref
    ) => {
      const { i18n } = useTranslation()

      const [editEnabled, setEditEnabled] = useState(true)
      const inputId = id || `input-${generateRandomId()}`

      return (
        <FormGroup variant={variant} ref={ref}>
          {title && <InputTitle>{title}</InputTitle>}
          {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
          {helpText && <HelpText text={helpText} />}

          <div>
            <InputContainer>
              <InputField
                id={inputId}
                rows={rows}
                wide={type !== 'color'}
                placeholder={placeholder}
                type={type}
                name={name}
                value={value || ''}
                error={!!error}
                onChange={onChange}
                onBlur={onBlur}
                onKeyUp={onKeyUp || null}
              />
              {editEnabled && editButton && (
                <EditButton onClick={() => setEditEnabled(false)}>
                  {i18n.t('form.input.edit')}
                </EditButton>
              )}
            </InputContainer>
            {info && <InputFeedback>{info}</InputFeedback>}
            {success && <InputFeedbackSuccess>{success}</InputFeedbackSuccess>}
            {error && <InputFeedbackError>{error}</InputFeedbackError>}
          </div>
        </FormGroup>
      )
    }
  )

export const SelectFormGroup = ({
  title,
  label,
  name,
  helpText,
  options,
  id,
  placeholder,
  value,
  info,
  error,
  success,
  onChange,
  variant = FormGroupVariant.Regular,
}: ISelectFromGroupProps) => {
  const inputId = id || `input-${generateRandomId()}`

  return (
    <FormGroup variant={variant}>
      {title && <InputTitle>{title}</InputTitle>}
      {label && <InputLabel htmlFor={inputId}>{label}</InputLabel>}
      {helpText && <HelpText text={helpText} />}

      <div>
        <Select
          id={inputId}
          wide
          options={options}
          placeholder={placeholder}
          name={name}
          value={value}
          error={!!error}
          onChange={onChange}
        />
        {info && <InputFeedback>{info}</InputFeedback>}
        {success && <InputFeedbackSuccess>{success}</InputFeedbackSuccess>}
        {error && <InputFeedbackError>{error}</InputFeedbackError>}
      </div>
    </FormGroup>
  )
}

export const InputFormGroup = formGroupHOC(Input)
export const InputPasswordFormGroup = formGroupHOC(InputPassword)
export const TextareaFormGroup = formGroupHOC(Textarea)

export const FileLoaderFormGroup = forwardRef<HTMLDivElement, FileFormGroupProps>(({
  title,
  label,
  id,
  file,
  accept,
  url,
  error,
  success,
  info,
  maxMbSize,
  onChange,
  onSelect,
  variant = FormGroupVariant.Regular,
}: FileFormGroupProps, ref) => {
  const fileInputId = id || `file-${generateRandomId()}`

  return (
    <FormGroup variant={variant} ref={ref}>
      {title && <InputTitle>{title}</InputTitle>}
      {label && <InputLabel>{label}</InputLabel>}

      <FileLoader
        onSelect={onSelect}
        onChange={onChange}
        maxMbSize={maxMbSize}
        file={file}
        error={error}
        url={url}
        accept={accept}
      />
      {info && <InputFeedback>{info}</InputFeedback>}
      {success && <InputFeedbackSuccess>{success}</InputFeedbackSuccess>}
    </FormGroup>
  )
})

const InputContainer = styled.div`
  position: relative;
`

const EditButton = styled.span`
  position: absolute;
  right: 8px;
  top: 8px;
  line-height: 40px;
  font-size: 16px;
  font-weight: 500;
  display: inline-block;
  cursor: pointer;
  color: ${({ theme }) => theme.accent1};
`

const InputTitle = styled(SectionTitle)`
  font-size: 26px;
  font-weight: 400;
  color: ${({ theme }) => theme.blueText};
`

const InputLabel = styled.label`
  font-weight: 600;
  font-size: 13px;
  line-height: 1.6em;
`

const InputFeedback = styled.p`
  position: absolute;
  margin: 0 0 0 4px;
  bottom: -10px;
  font-size: 12px;
  font-weight: 500;
  color: ${({ theme }) => theme.lightText};
`

const InputFeedbackError = styled(InputFeedback)`
  color: ${({ theme }) => theme.danger};
`

const InputFeedbackSuccess = styled(InputFeedback)`
  color: ${({ theme }) => theme.success};
`

export const FormGroup = styled.div<{ variant: FormGroupVariant }>`
  position: relative;
  ${({ theme, variant }) =>
    FormGroupVariantStyle[variant || FormGroupVariant.Small](theme)}
`

export const Fieldset = styled.fieldset`
  border: none;
  padding: 0;
`
