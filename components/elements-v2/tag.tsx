import { colorsV2 } from '@theme/colors-v2'
import { ReactNode } from 'react'
import { When } from 'react-if'
import styled from 'styled-components'
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
    <>
      <StyledTag {...props}>
        {props.children}
      </StyledTag>
      <When condition={!!props.label}>
        <StyledLabel>
          <Text size='xs' weight='medium' color='dark-blue'>
            {props.label}
          </Text>
        </StyledLabel>
      </When>
    </>
  )
}
const cosmeticProps = ['variant', 'size', 'fontWeight', 'label']
const styledConfig = {
  shouldForwardProp: (prop) => !cosmeticProps.includes(prop)
}

const StyledTag = styled.span.withConfig(styledConfig)<ITagProps>`
  border-radius: 4px;
  padding: 0px 12px;
  font-family: Manrope;
  line-height:${getTagHeigth};
  font-size:${getTagFontSize};
  font-weight:${getTagFontWeight};
  background:${getTagBackgroundColor};
  color:${getTagColor};
`
const StyledLabel = styled.span`
  margin-left: 16px;
  line-height:${getTagHeigth};
`

function getTagHeigth(props: ITagProps) {
  switch (props.size) {
    case 'large':
      return '32px'
    case 'regular':
      return '24px'
    default:
      return '24px'
  }
}
function getTagFontSize(props: ITagProps) {
  switch (props.size) {
    case 'large':
      return '16px'
    case 'regular':
      return '14px'
    default:
      return '14px'
  }
}
function getTagFontWeight(props: ITagProps) {
  switch (props.fontWeight) {
    case 'bold':
      return 700
    case 'regular':
      return 400
    default:
      return 700
  }
}

function getTagColor(props: ITagProps) {
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
function getTagBackgroundColor(props: ITagProps) {
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


