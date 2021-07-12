import React, { useState, ReactNode, useEffect, MouseEvent } from 'react'
import styled from 'styled-components'

import { CardDiv } from '@components/elements/cards'

import { DropDownContext } from './dropdown-context'

interface DropdownProps {
  toggleButton: ReactNode,
  children: ReactNode
}

export const Dropdown = ({ toggleButton, children }: DropdownProps) => {
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
      <DropdownItemsContainer>
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

const DropdownItemsContainer = styled(CardDiv)`
  position: absolute;
  border-radius: 12px;
  margin-top: 10px;
  min-width: 100px;
  overflow: hidden;
  padding: 0 !important;
  right: 0;
`