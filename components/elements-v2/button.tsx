import { FlexContainer, FlexAlignItem, FlexJustifyContent } from "@components/elements/flex";
import { colors } from "@theme/colors";
import { ReactNode, useEffect, useState } from "react";
import { When } from "react-if";
import styled from "styled-components";
import { Col, Row, IColProps } from "./grid";
import { theme } from "@theme/global";
import { Icon, IconProps, Rotate } from "./icons";
import { colorsV2 } from "@theme/colors-v2";

// Review download in case the button its used in more places
type ButtonVariant = 'light' | 'primary' | 'outlined' | 'white' | 'text' | 'white-error'
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
  tabIndex?: number
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
  const textColor = getTextColor(props)
  const [iconColor, setIconColor] = useState(textColor)
  useEffect(() => {
    setIconColor(textColor)
  }, [textColor])
  const handleOnClick = (props: ButtonProps) => {
    if (!props.disabled && !props.loading) {
      props.onClick()
    }
  }
  const handleOnKeyUp = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      if (!props.disabled && !props.loading) {
        props.onClick()
      }
    }
  }
  return (
    <BaseButton
      onClick={() => handleOnClick(props)}
      tabIndex={props.tabIndex ? props.tabIndex : 0}
      onKeyUpCapture={handleOnKeyUp}
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

const cosmeticProps = ['color', 'backgroundColor', 'width', 'variant', 'size', 'disabled', 'icon', 'loading']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}

const BaseButton = styled.div.withConfig(styledConfig) <StyledButtonProps>`
cursor: ${getCursor};
box-sizing: border-box;
border-radius: 8px;
font-family: Manrope;
padding: 0px 24px;
height: ${getHeight};
font-weight: 600;
font-size: ${getButtonFontSize};
text-align: center;
border: ${getBorderColor};
color: ${getTextColor};
background: ${getBackgroundColor};
width: ${getWidth};
box-shadow: ${getBoxShadow};
transition: 0.3s;
// opacity: ${getOpacity};
&:hover {
  div{props}{

  }
  border: ${getBorderColorHover};
  background: ${getBackgroundColorHover};
  color: ${getTextColorHover};
  opacity: ${getOpacity};
}
& > * {
  pointer-events: ${getPointerEvents};
}
`
const StyledCol = styled(Col).withConfig(styledConfig) <LoadingColProps> `
  visibility: ${(props) => props.loading ? 'hidden' : 'visible'};
`
const LoadingCol = styled(Col).withConfig(styledConfig) <LoadingColProps> `
  display: ${(props) => props.loading ? '' : 'none'};
  position: absolute;
`

// ======= //
// HELPERS //
// ======= //

function getTextColor(props: StyledButtonProps) {
  if (props.disabled) {
    return colorsV2.neutral[400]
  }
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
    case 'white-error':
    case 'white':
      if (props.disabled) {
        return "#7B8794"
      }
      return theme.accent1
  }
}

function getBackgroundColor(props: StyledButtonProps) {
  if (props.disabled) {
    return colorsV2.neutral[50]
  }
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
    case 'white-error':
    case 'white':
      return theme.white
  }
}
function getBorderColor(props: StyledButtonProps) {
  switch (props.variant) {
    case 'light':
      return `2px solid ${theme.lightBorder}`
    case 'outlined':
      if (props.disabled) {
        return `2px solid ${colorsV2.neutral[100]}`
      }
      return `2px solid ${props.color ? props.color : theme.accent1}`
    case 'white-error':
    case 'white':
      // TODO Colors
      if (props.disabled) {
        return ''
      }
      return `2px solid ${colorsV2.neutral[100]}`
    default:
      return ''
  }
}
function getBorderColorHover(props: StyledButtonProps) {
  // TODO Colors
  if (props.disabled) {
    switch (props.variant) {
      case 'light':
        return `2px solid ${theme.lightBorder}`
      case 'outlined':
        return `2px solid ${colorsV2.neutral[100]}`
      case 'white-error':
        return ''
      case 'white':
        // TODO Colors
        return ''
      default:
        return ''
    }
  }
  switch (props.variant) {
    case 'white-error':
      return `2px solid ${colorsV2.support.critical[600]}`
    case 'white':
      return `2px solid ${getTextColor(props)}`
  }
}
function getBackgroundColorHover(props: StyledButtonProps) {
  if (!props.disabled && !props.loading) {
    switch (props.variant) {
      case 'outlined':
        return getTextColor(props)
      case 'white-error':
        return colorsV2.support.critical[600]
    }
  }
}

function getTextColorHover(props: StyledButtonProps) {
  if (!props.disabled) {
    switch (props.variant) {
      case 'white-error':
      case 'outlined':
        return theme.white
      default:
        return getTextColor(props)
    }
  }
  return getTextColor(props)
}

function getWidth(props: StyledButtonProps) {
  if (!props.width) {
    return 'auto'
  }
  return `${props.width} px`
}

function getHeight(props: StyledButtonProps) {
  switch (props.size) {
    case 'sm':
      return '40px'
    case 'lg':
      return '56px'
    default:
      return '48px'
  }
}
function getBoxShadow(props: StyledButtonProps) {
  switch (props.variant) {
    case 'primary':
      return '0px 3px 3px rgba(180, 193, 228, 0.2)'
    case 'white-error':
    case 'white':
      return '0px 3px 3px rgba(180, 193, 228, 0.2)'
    default:
      return ''
  }
}
function getOpacity(props: StyledButtonProps) {
  if (!props.disabled) {
    switch (props.variant) {
      case 'primary':
        return 0.65
    }
  }
  return 1
}
function getButtonFontSize(props: StyledButtonProps) {
  switch (props.size) {
    case 'lg':
      return '20px'
    default:
      return '16px'
  }
}

function getPointerEvents(props: StyledButtonProps) {
  if (props.disabled) {
    return 'none'
  }
  return 'auto'
}
function getCursor(props: StyledButtonProps) {
  if (props.disabled || props.loading) {
    return 'not-allowed'
  }
  return 'pointer'
}
