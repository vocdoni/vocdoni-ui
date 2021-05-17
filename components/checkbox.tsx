import React from 'react'
import Link from 'next/link'

import styled from 'styled-components'
import { Checkbox as AragonCheckbox } from '@aragon/ui'
import { Label } from '@components/label'

import i18n from '@i18n'

interface ICheckboxProps {
  id: string
  checked: boolean
  onChange: (value: boolean) => void
  text: string
  href?: string
  labelColor?: string
}

export const Checkbox = ({ id, checked, onChange, text, href = '', labelColor = '' }: ICheckboxProps) => (
  <CheckboxContainer>
    <AragonCheckbox id={id} checked={checked} onChange={onChange} />

    {(href) ? (
      <Label htmlFor={id} color={(labelColor) ? labelColor : 'default'}>
        <Link href={href}>
          {text}
        </Link>
      </Label>
    ) : (
      <Label htmlFor={id} color={(labelColor) ? labelColor : 'default'}>
        {text}
      </Label>
    )}

  </CheckboxContainer>
)

const CheckboxContainer = styled.div`
  flex-shrink: 0;
  margin-right: 4px;
  margin-top: 6px;
`
