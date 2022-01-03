import { theme } from "@theme/global"
import { ReactNode } from "react"
import styled from "styled-components"


export type ITextProps = {
  children: ReactNode
  variant?: TextVariant
  /**
   * xxs > 12px
   *
   * xs > 14px
   *
   * sm > 16px
   *
   * md > 18px
   *
   * lg > 20px
   *
   * xl > 22px
   *
   * xxl > 24px
   *
   * display-1 > 32px
   */
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
}

type TextVariant = 'title' | 'subtitle' | 'body'
type TextSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'display-1'
type TextWeight = 'light' | 'regular' | 'bold'
type TextColor = 'primary' | 'dark-blue' | 'dark-gray'

export const Text = (props: ITextProps) => {
  return (
    <BaseText {...props} >
      {props.children}
    </BaseText>
  )
}

const getTextSize = (props: ITextProps) => {
  if (props.size) {
    switch (props.size) {
      case 'xxs':
        return '12px'
      case 'xs':
        return '14px'
      case 'sm':
        return '16px'
      case 'md':
        return '18px'
      case 'lg':
        return '20px'
      case 'xl':
        return '22px'
      case 'xxl':
        return '24px'
      case 'display-1':
        return '32px'
      default:
        return '18px'
    }
  }
  switch (props.variant) {
    case 'title':
      return '24px'
    case 'subtitle':
      return '20px'
    case 'body':
      return '16px'
  }
}
const getTextWeight = (props: ITextProps) => {
  if (props.weight) {
    switch (props.weight) {
      case 'light':
        return 300
      case 'regular':
        return 400
      case 'bold':
        return 600
    }
  }
  switch (props.variant) {
    case 'title':
      return 400
    case 'subtitle':
      return 600
    case 'body':
      return 600
  }
}
const getTextColor = (props: ITextProps) => {
  if (props.color) {
    switch (props.color) {
      case 'dark-blue':
        return theme.blueText
      case 'primary':
        return theme.accent1
      case 'dark-gray':
        return theme.lightText
    }
  }
  switch (props.variant) {
    case 'title':
      return theme.blueText
    case 'subtitle':
      return theme.blueText
    case 'body':
      return theme.lightText
  }
}
const BaseText = styled.span<ITextProps>`
  font-family: Manrope;
  font-size: ${getTextSize};
  font-weight: ${getTextWeight};
  color:  ${getTextColor};
`
