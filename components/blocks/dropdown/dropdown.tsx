import React, { useState, ReactNode, useEffect, MouseEvent } from 'react'
import styled from 'styled-components'

import { CardDiv } from '@components/elements/cards'

import { DropDownContext } from './dropdown-context'

interface DropdownProps {
  toggleButton: ReactNode,
  width?: string,
  children: ReactNode
}

export const Dropdown = ({ toggleButton, width, children }: DropdownProps) => {
  const [isOpened, setIsOpened] = useState<boolean>()

  useEffect(() => {
    document.addEventListener('click', handleDomEvent)

    return () => document.removeEventListener('click', handleClick)
  }, [])

  const handleDropdownClick = (event: MouseEvent) => {
    event.stopPropagation();
  }

  const handleDomEvent = () => {
    setIsOpened(false)
  }

  const handleToggle = () => {
    setIsOpened(!isOpened)
  }

  const handleClick = () => {
    setIsOpened(false)
  }

  return <DropdownWrapper onClick={handleDropdownClick}>
    <div onClick={handleToggle}>
      {toggleButton}
    </div>

    {isOpened && (
      <DropdownItemsContainer width={width}>
        <DropDownContext.Provider value={{ onClickElement: handleClick }}>
          {children}
        </DropDownContext.Provider>
      </DropdownItemsContainer>
    )}
  </DropdownWrapper>
}

const DropdownWrapper = styled.div`
  position: relative
`

const DropdownItemsContainer = styled.div<{width: string}>`
  position: absolute;
  padding: 11px 20px;
  width: ${({ width }) => width? width: 'auto'};
  background: ${(props) => props.theme.white};
  border: ${({ theme }) =>`solid 2px ${theme.lightBorder}`};
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 12px;
  margin-top: 10px;
  min-width: 100px;
  overflow: hidden;
  padding: 0 !important;
  right: 0;
`