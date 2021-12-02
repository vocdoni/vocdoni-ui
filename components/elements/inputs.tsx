import React, { ReactElement, useState } from 'react'
import styled, { DefaultTheme, StyledComponentProps } from 'styled-components'
import {
  default as ReactSelect,
  Props as SelectProps,
  OptionTypeBase,
} from 'react-select'
import { useTranslation } from 'react-i18next'

interface IInputProps {
  wide?: boolean
  type?: string
  error?: boolean
}

export interface ISelectOption {
  label: string
  value: string | number
}

export type Input = typeof Input
export const Input = styled.input<IInputProps>`
  padding: ${({ type }) => (type == 'color' ? '0px' : '11px')};
  margin-top: 8px;
  color: ${({ error, theme }) => (error ? '#FF2929' : theme.blueText)};
  border: 2px solid ${({ theme, error }) => (error ? '#FF2929' : '#EFF1F7;')};
  box-shadow: ${({ error }) =>
    error
      ? 'inset 0px 2px 3px rgba(180, 193, 228, 0.35)'
      : 'inset 0px 2px 3px rgba(180, 193, 228, 0.35)'};
  box-sizing: border-box;
  border-radius: 8px;
  outline-width: 0;
  margin-bottom: 10px;
  ${({ wide }) => (wide ? 'width: 100%;' : '')}
  ${({ type }) => (type == 'color' ? 'height: 40px' : '')};

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 11px 16px;
    line-height: 22px;
    font-size: 16px;
  }
`

enum InputType {
  Text = 'text',
  Password = 'password',
}

export const InputPassword = (
  props: StyledComponentProps<'input', DefaultTheme, IInputProps, never>
) => {
  const { i18n } = useTranslation()
  const [inputType, setInputType] = useState<InputType>(InputType.Password)

  const handleClick = () => {
    const newType = inputType === InputType.Password ? InputType.Text : InputType.Password
    setInputType(newType)
  }

  return (
    <InputContainer wide={props.wide}>
      <Input {...props} type={inputType} />

      <ShowContainer
        onClick={handleClick}
      >
        {inputType === InputType.Password
          ? i18n.t('input.show')
          : i18n.t('input.hide')}
      </ShowContainer>
    </InputContainer>
  )
}

const ShowContainer = styled.div`
  position: absolute;
  right: 14px;
  top: 10px;
  height: 40px;
  font-size: 12px;
  line-height: 40px;
  cursor: pointer;
  color: ${({ theme }) => theme.lightText};
`

const InputContainer = styled.div<{ wide: boolean }>`
  display: ${({ wide }) => (wide ? 'block' : 'inline-block')};
  position: relative;
`

export type Textarea = typeof Textarea
export const Textarea = styled.textarea<IInputProps>`
  padding: 11px;
  font-family: 'Manrope', 'Roboto', Arial, Helvetica, sans-serif !important;
  margin-top: 8px;
  border: 2px solid #eff1f7;
  box-sizing: border-box;
  border: 2px solid ${({ theme, error }) => (error ? '#FF2929' : '#EFF1F7;')};
  box-shadow: ${({ error }) =>
    error
      ? 'inset 0px 2px 3px rgba(180, 193, 228, 0.35)'
      : 'inset 0px 2px 3px rgba(180, 193, 228, 0.35)'};  border-radius: 8px;
  outline-width: 0;
  margin-bottom: 10px;
  ${({ wide }) => (wide ? 'width: 100%;' : '')}

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 11px 16px;
    line-height: 22px;
    font-size: 16px;
  }
`

const selectStyles = {
  control: (provided) => ({
    ...provided,
    marginTop: '8px',
    paddingTop: '1px',
    border: '2px solid #EFF1F7',
    boxShadow: 'inset 0px 2px 3px rgba(180, 193, 228, 0.35)',
    borderRadius: '8px',
    '&:hover': {
      boxShadow: 'inherit',
    },
  }),
  indicatorSeparator: (provided) => ({
    display: 'none',
  }),
}

export type Select = typeof Select

// Select type
export const Select = (props: SelectProps<OptionTypeBase>): ReactElement => {
  return <ReactSelect styles={selectStyles} {...props}></ReactSelect>
}
