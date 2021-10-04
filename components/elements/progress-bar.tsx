import React from 'react'
import styled from 'styled-components'

interface IProgressBarProps {
  value: number
  max: number
  color?: string
}
export const ProgressBar = ({ value, max, color }: IProgressBarProps) => {
  return (
    <ProgressBarContainer>
      <ProgressBarInner width={(value / max) * 100} color={color} />
    </ProgressBarContainer>
  )
}

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 2px;
  background-color: #e6e6e6;
`

const ProgressBarInner = styled.div<{ width; color }>`
  width: ${({ width }) => (width ? width : '0')}%;
  height: 6px;
  color: ${({ color, theme }) => (color ? color : theme.accent1)};
`
