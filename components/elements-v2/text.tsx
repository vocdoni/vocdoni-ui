import { theme } from "@theme/global"
import { ReactNode } from "react"
import styled from "styled-components"
import parse from 'html-react-parser'
import { colorsV2 } from "@theme/colors-v2"

export type TextProps = {
  children?: ReactNode
  variant?: TextVariant
  /**
   * 2xs > 12px
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
   * 2xl > 24px
   *
   * display-1 > 32px
   *
   * display-2 > 38px
   *
   * display-3 > 44px
   */
  size?: TextSize
  weight?: TextWeight
  color?: TextColor
  align?: TextAlign
  innerHTML?: string
}

type TextVariant = 'title' | 'subtitle' | 'body'
export type TextSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'display-1' | 'display-2' | 'display-3'
export type TextWeight = 'light' | 'regular' | 'medium' | 'bold'
export type TextColor = 'primary' | 'dark-blue' | 'dark-gray' | 'white' | 'error' | 'secondary' | 'light-gray' | string
type TextAlign = 'center' | 'right' | 'left' | 'justify'

export const Text = (props: TextProps) => {
  let html
  if (props.innerHTML) {
    html = parse(props.innerHTML)
  }
  return (
    <BaseText {...props} >
      <span>{props.innerHTML ? html : props.children}</span>
    </BaseText>
  )
}

const cosmeticProps = ['size', 'weight', 'color', 'align', 'innerHtml']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}
const BaseText = styled.span.withConfig(styledConfig)<TextProps>`
  font-family: Manrope;
  font-size: ${getTextSize};
  font-weight: ${getTextWeight};
  color:  ${getTextColor};
  text-align: ${getTextAlign};
  white-space: pre-wrap;
`

function getTextAlign(props: TextProps) {
  switch (props.align) {
    case 'center':
      return 'center'
    case 'right':
      return 'right'
    case 'left':
      return 'left'
    case 'justify':
      return 'justify'
    default:
      return ''
  }
}

function getTextSize(props: TextProps) {
  if (props.size) {
    switch (props.size) {
      case '2xs':
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
      case '2xl':
        return '24px'
      case 'display-1':
        return '32px'
      case 'display-2':
        return '38px'
      case 'display-3':
        return '44px'
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
function getTextWeight(props: TextProps) {
  if (props.weight) {
    switch (props.weight) {
      case 'light':
        return 300
      case 'regular':
        return 400
      case 'medium':
        return 500
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
function getTextColor(props: TextProps) {
  if (props.color) {
    switch (props.color) {
      case 'dark-blue':
        return theme.blueText
      case 'primary':
        return theme.accent1
      case 'secondary':
        return theme.textAccent1
      case 'dark-gray':
        return colorsV2.neutral[600]
      case 'light-gray':
        return colorsV2.neutral[400]
      // return theme.lightText
      case 'error':
        return colorsV2.support.critical[600]
      case 'white':
        return theme.white
    }
    return props.color
  }
  switch (props.variant) {
    case 'title':
      return theme.blueText
    case 'subtitle':
      return colorsV2.neutral[400]
    case 'body':
      return theme.lightText
  }
}
