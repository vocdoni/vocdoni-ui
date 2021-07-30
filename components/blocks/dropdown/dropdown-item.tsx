import React, { useContext, ReactNode, MouseEvent } from 'react'
import Link from 'next/link'
import styled from 'styled-components'


import { DropDownContext } from './dropdown-context'

interface DropdownItemProps {
  children: ReactNode,
  onClick?: () => void
  href?: string
  target?: '_blank' | '_self' | '_parent'
  disableHover?: boolean
  preventClose?: boolean
}


export const DropdownItem = ({ children, href, target, disableHover, preventClose, onClick }: DropdownItemProps) => {
  const { onClickElement } = useContext(DropDownContext)
  
  const handleClick = (event: MouseEvent) => {
    // if (preventClose) event.stopPropagation()
    if (onClick) onClick()
    if (onClickElement && !preventClose) onClickElement()
  }

  return href ?
    <Link href={href} passHref>
      <a target={target ||  '_self'}>
        <DropdownItemDivContainer
          hasHover={!disableHover}
          onClick={handleClick}
        >{children}</DropdownItemDivContainer>
      </a>
    </Link>
    :
    <DropdownItemDivContainer
      hasHover={!disableHover}
      onClick={handleClick}
    >{children}</DropdownItemDivContainer>
}

export const DropdownItemDivContainer = styled.div<{ hasHover?: boolean }>`
  padding: 16px 15px;
  width: 100%;
  
  cursor: ${({ hasHover, theme }) => hasHover ? 'pointer' : 'default'};
  ${({ hasHover, theme }) => hasHover ? `&:hover { background-color: ${theme.lightBg}};` : ''}
`
