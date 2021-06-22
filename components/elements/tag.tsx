import React, { ReactNode } from "react"
import styled from "styled-components"

type TagProps = {
  negative?: boolean,
  large?: boolean,
  children: ReactNode
}

export const Tag = ({ negative, large, children }: TagProps) => {
  return <TagDiv negative={negative} large={large}>
    {children}
  </TagDiv>
}

const TagDiv = styled.div<{ large?: boolean, negative?: boolean }>`
  ${props => props.large ? "padding: 11px 20px;" :
      "padding: 8px 15px;"}

  ${props => props.large ? "" : "font-size: 85%;"}

  background: ${({ theme, negative }) => negative ? theme.accent2B : theme.accent1C};
  color: ${({ theme }) => theme.white};
  border-radius: 8px;
  user-select: none;
  margin-bottom: 10px;
  box-sizing: border-box;
`
