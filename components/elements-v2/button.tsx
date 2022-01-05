import { FlexContainer, FlexAlignItem, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import { ReactNode } from "react";
import { When } from "react-if";
import styled from "styled-components";
import { Col, Row } from "./grid";
import { theme } from "@theme/global";


type ButtonVariant = 'light' | 'primary' | 'outlined' | 'white'
type ButtonFontSize = 'regular' | 'large'
export interface ButtonProps {
  children?: string
  onClick?: () => void
  iconLeft?: ReactNode
  iconRight?: ReactNode
  variant?: ButtonVariant
  disabled?: boolean
  color?: string
  backgroundColor?: string
  width?: number | string
  fontSize?: ButtonFontSize
}

interface StyledButtonProps {
  color?: string
  backgroundColor?: string
  width?: number | string
  variant?: ButtonVariant
  fontSize?: ButtonFontSize
}

export const Button = (props: ButtonProps) => {
  return (
    <BaseButton
      onClick={props.onClick}
      color={props.color}
      backgroundColor={props.backgroundColor}
      width={props.width}
      variant={props.variant}
      fontSize={props.fontSize}
    >
      <Row
        gutter="md"
        align="center"
        justify="center"
      >
        {props.iconLeft && <Col>{props.iconLeft}</Col>}
        <Col>
          {props.children}
        </Col>
        {props.iconRight && <Col>{props.iconRight}</Col>}
      </Row>
    </BaseButton>
  )
}

const getTextColor = (props: StyledButtonProps) => {
  if (props.color) {
    return props.color
  }
  switch (props.variant) {
    case 'light':
      return theme.blueText
    case 'outlined':
      return theme.accent1
    case 'primary':
      return theme.white
    case 'white':
      return theme.accent1
  }
}
const getBackgroundColor = (props: StyledButtonProps) => {
  if (props.backgroundColor) {
    return props.backgroundColor
  }
  switch (props.variant) {
    case 'light':
      return theme.white
    case 'outlined':
      return theme.white
    case 'primary':
      return `linear-gradient(110.89deg, ${theme.accent1B} 0%, ${theme.accent1} 100%)`
    case 'white':
      return theme.white
  }
}
const getBorderColor = (props: StyledButtonProps) => {
  switch (props.variant) {
    case 'light':
      return `2px solid ${theme.lightBorder}`
    case 'outlined':
      return `2px solid ${props.color ? props.color : theme.accent1}`
    case 'white':
      return `2px solid ${theme.lightBorder}`
    default:
      return ''
  }
}
const getWidth = (props: StyledButtonProps) => {
  if (props.width) {
    return 'auto'
  }
  return props.width
}
const getBoxShadow = (props: StyledButtonProps) => {
  switch (props.variant) {
    case 'primary':
      return '0px 3px 3px rgba(180, 193, 228, 0.25)'
    case 'white':
      return '0px 3px 3px rgba(180, 193, 228, 0.25)'
    default:
      return ''
  }
}
const getButtonFontSize = (props: StyledButtonProps) => {
  switch (props.fontSize) {
    case 'regular':
      return '16px'
    case 'large':
      return '20px'
    default:
      return '16px'
  }
}

const BaseButton = styled.div<StyledButtonProps>`
cursor: pointer;
// box-sizing: border-box;
border-radius: 8px;
font-family: Manrope;
padding: 12px 20px;
font-weight: 600;
font-size: ${getButtonFontSize};
text-align: center;
border: ${getBorderColor};
color: ${getTextColor};
background: ${getBackgroundColor};
width: ${getWidth};
box-shadow: ${getBoxShadow};
`
