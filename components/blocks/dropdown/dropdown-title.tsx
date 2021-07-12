import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { DropdownItemDivContainer } from './dropdown-item'

interface DropdownTitleProps {
  children: ReactNode
}

export const DropdownTitle = ({ children }: DropdownTitleProps) => (
  <DropdownTitleContainer>{children}</DropdownTitleContainer>
)

const DropdownTitleContainer = styled(DropdownItemDivContainer)`
  cursor: default;
`