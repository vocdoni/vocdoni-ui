import React from 'react'
import styled from 'styled-components'

interface IProgressBarProps {
  value: number
  min: number
  max: number
  color?: string
}
export const ProgressBar = ({ value, min, max, color }: IProgressBarProps) => {
  return (
    <ProgressBarContainer>
      <ProgressBarInner width={((value - min) / (max - min)) * 100} color={color} />
    </ProgressBarContainer>
  )
}

const ProgressBarContainer = styled.div`
  width: 100%;
  height: 6px;
  border-radius: 2px;
  background-color: #e6e6e6;
  overflow: hidden;
`

const ProgressBarInner = styled.div<{ width; color }>`
  width: ${({ width }) => (width ? width : '0')}%;
  height: 6px;
  border-radius: 2px;
  background-color: ${({ color, theme }) => (color ? color : theme.accent1)};
`
