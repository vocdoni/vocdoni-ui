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
  hrefNewTab?: boolean
  labelColor?: string
}

export const Checkbox = ({ id, checked, onChange, text, href = '', labelColor = '', hrefNewTab }: ICheckboxProps) => (
  <CheckboxContainer>
    <CheckboxWrapper>
      <AragonCheckbox id={id} checked={checked} onChange={onChange} />
    </CheckboxWrapper>

    {(href) ? (
      <Label htmlFor={id} color={(labelColor) ? labelColor : 'default'}>
        <Link href={href}>
          <a target={hrefNewTab ? "_blank" : "_self"}>
            {text}
          </a>
        </Link>
      </Label>
    ) : (
      <Label htmlFor={id} color={(labelColor) ? labelColor : 'default'}>
        {text}
      </Label>
    )}

  </CheckboxContainer>
)

const CheckboxWrapper = styled.div`
  flex-shrink: 0;
`

const CheckboxContainer = styled.div`
  display: flex;
  align-items: center;

  margin-right: 4px;
  margin-top: 6px;

  & > label {
    margin-left: 6px;
  }
`
