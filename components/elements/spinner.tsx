import React from 'react'
import * as ReactSpinner from 'react-svg-spinner'
import styled from 'styled-components'

interface ISpinnerProps {
  size?: string
  color?: string
  gap?: number
}

export const Spinner = ({ size, color, gap }: ISpinnerProps) => {
  return <ReactSpinner size={size} color={color} gap={gap} />
}
