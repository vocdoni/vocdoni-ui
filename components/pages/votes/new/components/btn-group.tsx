import React from 'react'
import styled from 'styled-components'

interface IBteGroupProps {
  onClick: (e: React.MouseEvent<HTMLButtonElement>) => void
}

// export const BtnGroup = ({
//     onClick,
// }): IBteGroupProps => {

//     return 
// }

export const BtnGroupContainer = styled.div`
    border-radius: 16px;
    height: 88px;
    background-color: rgba(207, 218, 246, 0.15);
    display: flex;
`

export const BtnGroupText = styled.span`
  font-weight: 600;
  font-size: 18px;
  line-height: 25px;
  display: block;
  margin-bottom: 10px;
`

export const BtnGroupSubText = styled.span`
  font-size: 14px;
  line-height: 19px;
  display: block;
  color: ${({ theme }) => theme.lightText};
`

export const BtnGroup = styled.button<{ active?: boolean }>`
  border-radius: 16px;
  cursor: pointer;
  background-color: ${({ theme, active }) => active? theme.white: 'transparent'};
  border: ${({ theme, active }) => active ? '1px solid ' + theme.accent1 : 'none'};
  text-align: center;
  width: 100%;

  ${BtnGroupText} {
    color: ${({ theme, active }) => active ? theme.accent1 : theme.blueText};
  }
`