import { FlexContainer, FlexAlignItem, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import { ReactNode, useState } from "react";
import { When } from "react-if";
import styled from "styled-components";
import { Col, Row, IColProps } from "./grid";
import { theme } from "@theme/global";
import { Icon, IconProps, Rotate } from "./icons";

// Review download in case the button its used in more places
type ButtonVariant = 'light' | 'primary' | 'outlined' | 'white' | 'text'
type ButtonSize = 'sm' | 'md' | 'lg'
export interface ButtonProps {
  children?: string
  onClick?: () => void
  iconRight?: IconProps
  iconLeft?: IconProps
  variant?: ButtonVariant
  disabled?: boolean
  color?: string
  backgroundColor?: string
  width?: number
  size?: ButtonSize
  icon?: boolean
  loading?: boolean
}

interface StyledButtonProps {
  color?: string
  backgroundColor?: string
  disabled?: boolean
  width?: number
  variant?: ButtonVariant
  size?: ButtonSize
  icon?: boolean
  loading?: boolean
}

interface LoadingColProps extends IColProps {
  loading: boolean
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
      icon={props.icon}
      loading={props.loading}
      // used to update the icon color when the button is hovered
      onMouseOver={() => setIconColor(getTextColorHover(props))}
      onMouseLeave={() => setIconColor(getTextColor(props))}
    >
      {/* {props.loading ?
        <Row
          align="center"
          justify="center"
        >
          <Col>
            <Rotate>
              <Icon
                name="spinner"
                color={getTextColor(props)}
                size={24}
              />
            </Rotate>
          </Col>
        </Row>
        : */}

      <Row
        gutter="md"
        align="center"
        justify="center"
      >
        <LoadingCol loading={props.loading}>
          <Rotate>
            <Icon
              name="spinner"
              color={getTextColor(props)}
              size={24}
            />
          </Rotate>
        </LoadingCol>
        {props.iconLeft &&
          <StyledCol loading={props.loading}>
            <Icon
              name={props.iconLeft.name}
              size={props.iconLeft.size}
              color={iconColor}
            />
          </StyledCol>
        }

        <StyledCol loading={props.loading}>
          {props.children}
        </StyledCol>
        {props.iconRight &&
          <StyledCol loading={props.loading}>
            <Icon
              name={props.iconRight.name}
              size={props.iconRight.size}
              color={iconColor}
            />
          </StyledCol>
        }
      </Row>
      {/* } */}
    </BaseButton>
  )
}
const getTextColor = (props: StyledButtonProps) => {
  // TODO colors
  if (props.color) {
    return props.color
  }
  switch (props.variant) {
    case 'light':
      return theme.blueText
    case 'text':
      return theme.accent1
    case 'outlined':
      return theme.accent1
    case 'primary':
      return theme.white
    case 'white':
      if (props.disabled) {
        return "#7B8794"
      }
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
    case 'text':
      return 'transparent'
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
      if (props.disabled) {
        return `2px solid #E4E7EB`
      }
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
    switch (props.variant) {
      case 'light':
        return `2px solid ${theme.lightBorder}`
      case 'outlined':
        return `2px solid #E4E7EB`
      case 'white':
        // TODO Colors
        return `2px solid #E4E7EB`
      default:
        return ''
    }
  }
  switch (props.variant) {
    case 'white':
      return `2px solid ${getTextColor(props)}`
  }
}
const getBackgroundColorHover = (props: StyledButtonProps) => {
  if (!props.disabled && !props.loading) {
    switch (props.variant) {
      case 'outlined':
        return getTextColor(props)
    }
  }
}

const getTextColorHover = (props: StyledButtonProps) => {
  if (!props.disabled) {
    switch (props.variant) {
      case 'outlined':
        return theme.white
      default:
        return getTextColor(props)
    }
  }
  return getTextColor(props)
}

const getWidth = (props: StyledButtonProps) => {
  if (!props.width) {
    return 'auto'
  }
  return `${props.width}px`
}
const getPadding = (props: StyledButtonProps) => {
  if (props.variant === 'text') {
    return '0px'
  }
  // TODO
  // for some unknown reason the  padding when there is an
  // icon in the button grows from 12 to 14
  // the prop icon is used to make and equal size
  // button when an icon is not shown and should be
  // 13px 20px since the linke heigght of the text is 22 and
  // the icon normal size is 24 but since it ggrows a total of 2px
  // more it is switched to 15px 20px
  if (props.icon) {
    return '15px 20px'
  }
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
const getOpacity = (props: StyledButtonProps) => {
  if (props.disabled) {
    switch (props.variant) {
      case 'primary':
        return 0.65
      case 'outlined':
        return 0.25
    }
  }
  return 1
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
  if (props.disabled || props.loading) {
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
opacity: ${getOpacity};
&:hover {
  border: ${getBorderColorHover};
  background: ${getBackgroundColorHover};
  color: ${getTextColorHover};
}
& > * {
  pointer-events: ${getPointerEvents};
}
`
const StyledCol = styled(Col) <LoadingColProps> `
  visibility: ${(props) => props.loading ? 'hidden' : 'visible'};
`
const LoadingCol = styled(Col) <LoadingColProps> `
  display: ${(props) => props.loading ? '' : 'none'};
  position: absolute;
`
