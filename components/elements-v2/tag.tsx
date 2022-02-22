import { colorsV2 } from '@theme/colors-v2'
import { theme } from '@theme/global'
import { ReactNode } from 'react'
import { colors } from 'react-select/src/theme'
import styled from 'styled-components'
import { Col, Row } from './grid'
import { Text } from '.'


interface ITagProps {
  variant?: "neutral" | "success" | "error" | "info" | 'warning'
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
          <Text size='xs' weight='medium' color='dark-blue'>
            {props.label}
          </Text>
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
      return colorsV2.support.critical[600]
    case 'info':
      return colorsV2.support.info[600]
    case 'success':
      return colorsV2.support.success[600]
    case 'warning':
      return colorsV2.support.warning[600]
    default:
      // default is neutral
      return colorsV2.neutral[600]
  }
}
const getTagBackgroundColor = (props: ITagProps) => {
  switch (props.variant) {
    case 'error':
      return colorsV2.support.critical[100]
    case 'info':
      return colorsV2.support.info[100]
    case 'success':
      return colorsV2.support.success[100]
    case 'warning':
      return colorsV2.support.warning[100]
    default:
      // default is neutral
      return colorsV2.neutral[100]
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
  // font-family: Manrope;
  // font-weight: 500;
  // font-size: 14px;
  // color: #52606D;
  margin-left: 16px;
`
