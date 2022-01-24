import { theme } from '@theme/global'
import { ReactNode } from 'react'
import styled from 'styled-components'
import { Col, Row } from './grid'


interface ITagProps {
  variant?: "neutral" | "success" | "error" | "info"
  size?: 'regular' | 'large'
  fontWeight?: 'regular' | 'bold'
  label?: string
  /**
   * Children
   */
  children?: ReactNode
}
export const Tag = (props: ITagProps) => {

  return (
    <Row align='center'>
      <Col align='center'>
        <StyledTag {...props}>
          {props.children}
        </StyledTag>
      </Col>
      {props.label &&
        <StyledLabel>
          {props.label}
        </StyledLabel>
      }
    </Row>
  )
}

const getTagHeigth = (props: ITagProps) => {
  switch (props.size) {
    case 'large':
      return '32px'
    case 'regular':
      return '24px'
    default:
      return '24px'
  }
}
const getTagFontSize = (props: ITagProps) => {
  switch (props.size) {
    case 'large':
      return '16px'
    case 'regular':
      return '14px'
    default:
      return '14px'
  }
}
const getTagFontWeight = (props: ITagProps) => {
  switch (props.fontWeight) {
    case 'bold':
      return 700
    case 'regular':
      return 400
    default:
      return 700
  }
}

const getTagColor = (props: ITagProps) => {
  switch (props.variant) {
    case 'error':
      return theme.white
    case 'info':
      return theme.white
    case 'neutral':
      return theme.blueText
    case 'success':
      return theme.white
    default:
      return theme.blueText
  }
}
const getTagBackgroundColor = (props: ITagProps) => {
  switch (props.variant) {
    case 'error':
      return theme.error
    case 'info':
      return theme.blueText
    case 'neutral':
      return '#E4E7EB'
    case 'success':
      return theme.success
    default:
      return '#E4E7EB'
  }
}


const StyledTag = styled.div<ITagProps>`
  border-radius: 4px;
  padding: 0px 12px;
  font-family: Manrope;
  height:${getTagHeigth};
  font-size:${getTagFontSize};
  font-weight:${getTagFontWeight};
  background:${getTagBackgroundColor};
  color:${getTagColor};
`
const StyledLabel = styled.span`
  font-family: Manrope;
  font-weight: 600;
  font-size: 16px;
  color: #7A859F;
  margin-left: 16px;
`
