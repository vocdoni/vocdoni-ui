import React from 'react'
import styled from 'styled-components'
import { Checkbox as AragonCheckbox } from '@aragon/ui'

interface ICheckboxProps {
  id: string
  checked: boolean
  onChange: (value: boolean) => void
}

export const Checkbox = ({ id, checked, onChange }: ICheckboxProps) => (
  <CheckboxContainer>
    <AragonCheckbox id={id} checked={checked} onChange={onChange} />
  </CheckboxContainer>
)

const CheckboxContainer = styled.div`
  flex-shrink: 0;
  margin-right: 4px;
  margin-top: 6px;
`
