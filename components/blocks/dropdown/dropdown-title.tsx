import React, { ReactNode } from 'react'
import styled from 'styled-components'

import { DropdownItemDivContainer } from './dropdown-item'

interface DropdownTitleProps {
  children: ReactNode,
  onClick?: () => void,
}

export const DropdownTitle = ({ children, onClick }: DropdownTitleProps) => (
  <DropdownTitleContainer onClick={onClick}>{children}</DropdownTitleContainer>
)

const DropdownTitleContainer = styled(DropdownItemDivContainer)`
  cursor: default;
`