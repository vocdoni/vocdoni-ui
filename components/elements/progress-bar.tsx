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
`

const ProgressBarInner = styled.div<{ width; color }>`
  width: ${({ width }) => (width ? width : '0')}%;
  color: ${({ color, theme }) => (color ? color : theme.accent1)};
`
