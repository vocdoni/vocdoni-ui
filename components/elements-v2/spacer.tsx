import styled from "styled-components"

type SpacerDirection = 'vertical' | 'horizontal'

type SpacerSize = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'xxxl'

export type ISpacerProps = {
  direction: SpacerDirection
  /**
   *
   * xxs > adds a 4px spacer
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
   * xxl > adds a 40px spacer
   *
   * xxxl > adds a 48px spacer
   *
   */
  size: SpacerSize
}

const getSpacerMargin = (props: ISpacerProps) => {
  switch (props.size) {
    case 'xxs':
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
    case 'xxl':
      if (props.direction === 'vertical') {
        return '20px 0px'
      }
      return '0px 20px'
    case 'xxxl':
      if (props.direction === 'vertical') {
        return '24px 0px'
      }
      return '0px 24px'
    default:
      return '4px 0px'
  }
}

export const Spacer = styled.div<ISpacerProps>`
  margin : ${getSpacerMargin}
`
