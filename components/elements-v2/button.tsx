import { FlexContainer, FlexAlignItem, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import { ReactNode, useState } from "react";
import { When } from "react-if";
import styled from "styled-components";
import { Col, Row } from "./grid";
import { theme } from "@theme/global";
import { Icon, IconProps } from "./icons";

// Review download in case the button its used in more places
type ButtonVariant = 'light' | 'primary' | 'outlined' | 'white'
type ButtonSize = 'sm' | 'md' | 'lg'
export interface ButtonProps {
  children?: string
  onClick?: () => void
  // iconLeft?: ReactNode
  // iconRight?: ReactNode
  iconRight?: IconProps
  iconLeft?: IconProps
  variant?: ButtonVariant
  disabled?: boolean
  color?: string
  backgroundColor?: string
  width?: number
  size?: ButtonSize
}

interface StyledButtonProps {
  color?: string
  backgroundColor?: string
  disabled?: boolean
  width?: number
  variant?: ButtonVariant
  size?: ButtonSize
}

export const Button = (props: ButtonProps) => {
  const [iconColor, setIconColor] = useState(getTextColor(props))
  return (
    <BaseButton
      onClick={props.onClick}
      color={props.color}
      backgroundColor={props.backgroundColor}
      width={props.width}
      variant={props.variant}
      size={props.size}
      disabled={props.disabled}
      // used to update the icon color when the button is hovered
      onMouseOver={() => setIconColor(getTextColorHover(props))}
      onMouseLeave={() => setIconColor(getTextColor(props))}
    >
      <Row
        gutter="md"
        align="center"
        justify="center"
      >
        {props.iconLeft &&
          <Col>
            <Icon
              name={props.iconLeft.name}
              size={props.iconLeft.size}
              color={iconColor}
            />
          </Col>
        }

        <Col>
          {props.children}
        </Col>
        {props.iconRight &&
          <Col>
            <Icon
              name={props.iconRight.name}
              size={props.iconRight.size}
              color={iconColor}
            />
          </Col>
        }
      </Row>
    </BaseButton>
  )
}
const getTextColor = (props: StyledButtonProps) => {
  // TODO colors
  if (props.disabled) {
    return "#7B8794"
  }
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
  if (props.disabled) {
    return theme.white
  }
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
      // TODO Colors
      return `2px solid #E4E7EB`
    default:
      return ''
  }
}
const getBorderColorHover = (props: StyledButtonProps) => {
  // TODO Colors
  if (props.disabled) {
    return '2px solid #E4E7EB'
  }
  switch (props.variant) {
    case 'white':
      return `2px solid ${getTextColor(props)}`
  }
}
const getBackgroundColorHover = (props: StyledButtonProps) => {
  switch (props.variant) {
    case 'outlined':
      return getTextColor(props)
  }
}

const getTextColorHover = (props: StyledButtonProps) => {
  switch (props.variant) {
    case 'outlined':
      return theme.white
    default:
      return getTextColor(props)
  }
}

const getWidth = (props: StyledButtonProps) => {
  if (!props.width) {
    return 'auto'
  }
  return `${props.width}px`
}
const getPadding = (props: StyledButtonProps) => {
  switch (props.size) {
    case 'sm':
      return '8px 20px'
    default:
      return '12px 20px'
  }
}
const getBoxShadow = (props: StyledButtonProps) => {
  switch (props.variant) {
    case 'primary':
      return '0px 3px 3px rgba(180, 193, 228, 0.2)'
    case 'white':
      return '0px 3px 3px rgba(180, 193, 228, 0.2)'
    default:
      return ''
  }
}
const getButtonFontSize = (props: StyledButtonProps) => {
  switch (props.size) {
    case 'md':
      return '16px'
    case 'lg':
      return '20px'
    default:
      return '16px'
  }
}

const getPointerEvents = (props: StyledButtonProps) => {
  if (props.disabled) {
    return 'none'
  }
  return 'auto'
}
const getCursor = (props: StyledButtonProps) => {
  if (props.disabled) {
    return 'not-allowed'
  }
  return 'pointer'
}
const BaseButton = styled.div<StyledButtonProps>`
cursor: ${getCursor};
box-sizing: border-box;
border-radius: 8px;
font-family: Manrope;
padding: ${getPadding};
font-weight: 600;
font-size: ${getButtonFontSize};
text-align: center;
border: ${getBorderColor};
color: ${getTextColor};
background: ${getBackgroundColor};
width: ${getWidth};
box-shadow: ${getBoxShadow};
transition: 0.3s;
&:hover {
  border: ${getBorderColorHover};
  background: ${getBackgroundColorHover};
  color: ${getTextColorHover};
}
& > * {
  pointer-events: ${getPointerEvents};
}
`
