import React, { ReactElement } from 'react'
import styled from 'styled-components'
import {
  default as ReactSelect,
  Props as SelectProps,
  OptionTypeBase,
} from 'react-select'

interface IInputProps {
  wide?: boolean
}

export type Input = typeof Input
export const Input = styled.input<IInputProps>`
  padding: 11px;
  margin-top: 8px;
  border: 2px solid #eff1f7;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
  border-radius: 8px;
  outline-width: 0;
  margin-bottom: 10px;
  ${({ wide }) => (wide ? 'width: 100%;' : '')}
`

export type Textarea = typeof Textarea
export const Textarea = styled.textarea<IInputProps>`
  padding: 11px;
  margin-top: 8px;
  border: 2px solid #eff1f7;
  box-sizing: border-box;
  box-shadow: inset 0px 2px 3px rgba(180, 193, 228, 0.35);
  border-radius: 8px;
  outline-width: 0;
  margin-bottom: 10px;
  ${({ wide }) => (wide ? 'width: 100%;' : '')}
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
