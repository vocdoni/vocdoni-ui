import styled from "styled-components"

type SpacerDirection = 'vertical' | 'horizontal'

export type SpacerSize = '2xs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | string

export type SpacerProps = {
  direction: SpacerDirection
  /**
   *
   * 2xs > adds a 4px spacer
   *
   * xs > adds a 8px spacer
   *
   * sm > adds a 12px spacer
   *
   * md > adds a 16px spacer
   *
   * lg > adds a 24px spacer
   *
   * xl > adds a 32px spacer
   *
   * 2xl > adds a 40px spacer
   *
   * 3xl > adds a 48px spacer
   *
   */
  size: SpacerSize
  showDivider?: boolean
}

const getSpacerMargin = (props: SpacerProps) => {
  switch (props.size) {
    case '2xs':
      if (props.direction === 'vertical') {
        return '2px 0px'
      }
      return '0px 2px'
    case 'xs':
      if (props.direction === 'vertical') {
        return '4px 0px'
      }
      return '0px 4px'
    case 'sm':
      if (props.direction === 'vertical') {
        return '6px 0px'
      }
      return '0px 6px'
    case 'md':
      if (props.direction === 'vertical') {
        return '8px 0px'
      }
      return '0px 8px'
    case 'lg':
      if (props.direction === 'vertical') {
        return '12px 0px'
      }
      return '0px 12px'
    case 'xl':
      if (props.direction === 'vertical') {
        return '16px 0px'
      }
      return '0px 16px'
    case '2xl':
      if (props.direction === 'vertical') {
        return '20px 0px'
      }
      return '0px 20px'
    case '3xl':
      if (props.direction === 'vertical') {
        return '24px 0px'
      }
      return '0px 24px'
    case '4xl':
      if (props.direction === 'vertical') {
        return '32px 0px'
      }
      return '0px 24px'
    case '5xl':
      if (props.direction === 'vertical') {
        return '40px 0px'
      }
      return '0px 24px'
    case undefined:
      return '4px 0px'

    default:
      if (props.direction === 'vertical') {
        return `${props.size}px 0px`
      }
      return `0px ${props.size}px`
  }
}
const getSpacerBorder = (props: SpacerProps) => {
  if (props.showDivider) {
    // todo add to colors
    return '1.5px solid #EEF4FB'
  }
  return 'none'
}

export const Spacer = styled.div<SpacerProps>`
  margin:${getSpacerMargin};
  border: ${getSpacerBorder};
  box-sizing: border-box;

`
