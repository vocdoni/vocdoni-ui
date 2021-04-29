import React, { useState } from 'react'
import styled from 'styled-components'

import { SectionText } from '../text'

import { ProcessTypes, IProcessItem } from './process-list'

interface IDashboardProcessListNavProps {
  activeItem: ProcessTypes
  navItems: Map<ProcessTypes, IProcessItem>
  onClick: (navItem: ProcessTypes) => void
}

export const DashboardProcessListNav = ({
  activeItem,
  navItems,
  onClick,
}: IDashboardProcessListNavProps) => {
  const handleClick = (navKey: ProcessTypes) => {
    onClick(navKey)
  }
  
  const renderLiItem = (navKey: ProcessTypes, navItem: IProcessItem) => {
    const active = activeItem === navKey

    return (
      <li
        key={navKey}
        onClick={() => {
          handleClick(navKey)
        }}
      >
        <NavItem active={active}>{navItem.label}</NavItem>

        <NavCount visible={active}>{navItem.items.length}</NavCount>
      </li>
    )
  }

  return (
    <NavList>
      <ul>
        {[...navItems].map((navItem) => renderLiItem(navItem[0], navItem[1]))}
      </ul>
    </NavList>
  )
}

const NavItem = styled(SectionText)<{ active: boolean }>`
  color: ${({ theme, active }) => (active ? theme.accent1 : theme.text)};
  cursor: pointer;
  display: inline-block;
  font-weight: 500;

  &:hover {
    color: ${({ theme }) => theme.accent1};
  }
`

const NavCount = styled.span<{ visible: boolean }>`
  height: 20px;
  width: 20px;
  border-radius: 10px;
  line-height: 20px;
  text-align: center;
  display: inline-block;
  margin-left: 6px;
  visibility: ${({ visible }) => (visible ? 'visible' : 'hidden')};
  color: ${({ theme }) => theme.white};
  background-color: ${({ theme }) => theme.accent1};
`

const NavList = styled.nav`
  & > ul {
    list-style: none;
    padding-left: 10px;
    margin: 6px 0 -10px;

    & > li {
      display: inline-block;
      margin-right: 30px;
    }
  }
`
