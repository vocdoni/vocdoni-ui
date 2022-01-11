import { useIsMobile } from "@hooks/use-window-size"
import { theme } from "@theme/global"
import { forwardRef, ReactNode } from "react"
import { isMobileDevice } from "react-select/src/utils"
import styled from "styled-components"


interface CardProps {
  borderRadius?: CardBorderRadiusSize
  padding?: CardPadding | string
  variant?: CardVariant
  backgroundColor?: string
  children?: ReactNode
  flat?: boolean
  hover?: boolean
  height?: number | string
}

type CardBorderRadiusSize = 'sm' | 'md' | 'lg'
type CardPadding = 'none' | 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type CardVariant = 'white' | 'primary' | 'gray'

interface StyledCardProps extends CardProps {
  isMobile: boolean
}

export const Card = forwardRef<HTMLDivElement, CardProps>((props: CardProps, ref) => {
  const isMobile = useIsMobile()
  return (
    <StyledCard ref={ref} isMobile={isMobile} {...props} />
  )
})

const getBorderRadius = (props: StyledCardProps) => {
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
const getPadding = (props: StyledCardProps) => {
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
const getBackgroundColor = (props: StyledCardProps) => {
  if (props.backgroundColor) {
    return props.backgroundColor
  }
  switch (props.variant) {
    case 'white':
      return theme.white
    case 'gray':
      return theme.lightBg
    case 'primary':
      return `linear-gradient(110.89deg, ${theme.accentLight1B} 0%, ${theme.accentLight1} 100%)`
    default:
      return theme.white
  }
}
const getShadow = (props: StyledCardProps) => {
  if (props.flat) {
    return ''
  }
  switch (props.variant) {
    case 'white':
      return '0px 6px 6px rgba(180, 193, 228, 0.35)'
    case 'primary':
      return ''
    case 'gray':
      return ''
    default:
      return '0px 6px 6px rgba(180, 193, 228, 0.35)'
  }
}
const getBorder = (props: StyledCardProps) => {
  if (props.flat) {
    return ''
  }
  switch (props.variant) {
    case 'white':
      return `2px solid ${theme.lightBorder}`
    case 'primary':
      return ''
    case 'gray':
      return ''
    default:
      return `2px solid ${theme.lightBorder}`
  }
}
const getHover = (props: StyledCardProps) => {
  if (!props.hover) {
    return ''
  }
  switch (props.variant) {
    case 'white':
      return `${theme.lightBg}`
    default:
      return `${theme.lightBg}`
  }
}
const getHeight = (props: StyledCardProps) => {
  if (props.height) {
    return props.height
  }
  return ''
}

export const StyledCard = styled.div<StyledCardProps>`
  border-radius:${getBorderRadius};
  background: ${getBackgroundColor};
  padding: ${getPadding};
  box-shadow: ${getShadow};
  border: ${getBorder};
  min-height: ${getHeight};
  box-sizing: border-box;
  flex:1;
  transition: 0.3s;
  &:hover{
    background: ${getHover}
  }
`
