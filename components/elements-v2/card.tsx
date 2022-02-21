import { useIsMobile } from "@hooks/use-window-size"
import { theme } from "@theme/global"
import { forwardRef, ReactNode } from "react"
import styled from "styled-components"


interface CardProps {
  borderRadius?: CardBorderRadiusSize
  padding?: CardPaddingSize | string
  variant?: CardVariant
  backgroundColor?: CardBackgroundColor | string
  children?: ReactNode
  shadow?: boolean
  hover?: boolean
  height?: number | string
  borderWidth?: CardBorderSize | number
  borderColor?: CardBorderColor | string
}

type CardBorderRadiusSize = 'sm' | 'md' | 'lg'
type CardPaddingSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CardBorderSize = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CardBorderColor = 'light-gray' | 'gray'
export type CardVariant = 'white' | 'primary' | 'gray' | 'dashed' | 'white-elevated'
type CardBackgroundColor = 'white' | 'primary' | 'gray'

interface StyledCardProps extends CardProps {
  isMobile: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props: CardProps, ref) => {
  const isMobile = useIsMobile()
  return (
    <StyledCard ref={ref} isMobile={isMobile} {...props} />
  )
})
const cosmeticProps = ['borderRadius', 'padding', 'variant', 'backgroundColor', 'shadow', 'hover', 'height', 'borderWidth', 'borderColor', 'isMobile']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}
export const StyledCard = styled.div.withConfig(styledConfig)<StyledCardProps>`
  border-radius:${getBorderRadius};
  background: ${getBackgroundColor};
  padding: ${getPadding};
  box-shadow: ${getShadow};
  border: ${getBorderType};
  border-width: ${getBorderWidth};
  border-color: ${getBorderColor};
  min-height: ${getHeight};
  box-sizing: border-box;
  flex:1;
  transition: 0.3s;
  &:hover{
    background: ${getHover}
  }
`

// ======= //
// HELPERS //
// ======= //

function getBorderRadius  (props: StyledCardProps) {
  switch (props.borderRadius) {
    case 'sm':
      return '8px'
    case 'sm':
      return '16px'
    case 'lg':
      return '20px'
    default:
      return '16px'
  }
}
function getPadding  (props: StyledCardProps) {
  switch (props.padding) {
    case 'xs':
      return props.isMobile ? '24px' : '20px 24px'
    case 'sm':
      return props.isMobile ? '24px' : '24px'
    case 'md':
      return props.isMobile ? '24px' : '32px'
    case 'lg':
      return props.isMobile ? '24px' : '40px 36px'
    case 'xl':
      return props.isMobile ? '24px' : '40px 48px'
    case 'none':
      return '0px'
    case undefined:
      return '24px'
    default:
      return props.padding
  }
}
function getBackgroundColor  (props: StyledCardProps) {
  if (props.backgroundColor) {
    return props.backgroundColor
  }
  // Variants
  switch (props.variant) {
    case 'gray':
      return theme.lightBg
    case 'primary':
      return `linear-gradient(110.89deg, ${theme.accentLight1B} 0%, ${theme.accentLight1} 100%)`
    default:
      return theme.white
  }
}
function getShadow  (props: StyledCardProps) {
  if (props.shadow) {
    return '0px 6px 6px rgba(180, 193, 228, 0.35)'
  }
}
// solid ${theme.lightBorder}
function getBorderColor  (props: StyledCardProps) {
  // override
  if (props.borderColor) {
    // switch border sizes
    switch (props.borderColor) {
      case 'gray':
        // TODO COLORS  me to colors
        return '#DEEFFF'
      case 'light-gray':
        return theme.lightBorder
    }
    // custom border
    return props.borderColor
  }

  // variants
  switch (props.variant) {
    case 'dashed':
      return theme.accent1
    default:
      return 'transparent'
  }
}
function getBorderWidth  (props: StyledCardProps) {
  // override
  if (props.borderWidth) {
    // switch borderWidth
    switch (props.borderWidth) {
      case 'none':
        return '0px'
      case 'xs':
        return '1px'
      case 'sm':
        return '2px'
      case 'md':
        return '4px'
      case 'lg':
        return '6px'
      case 'xl':
        return '8px'
    }
    // custom borderWidth
    return `${props.borderWidth}px`
  }
  // variants
  switch (props.variant) {
    case 'dashed':
      return '2px'
    default:
      return '0px'
  }
}
function getBorderType  (props: StyledCardProps) {
  if (props.variant === 'dashed') {
    return 'dashed'
  }
  return 'solid'
}
function getHover  (props: StyledCardProps) {
  if (!props.hover) {
    return ''
  }
  switch (props.variant) {
    default:
      return `${theme.lightBg}`
  }
}
function getHeight  (props: StyledCardProps) {
  if (props.height) {
    return props.height
  }
  return ''
}

