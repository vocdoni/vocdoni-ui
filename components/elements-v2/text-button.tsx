import React, { ReactNode } from 'react'
import { Col, Row, Text } from '.'
import { Icon } from './icons'
import { theme } from '@theme/global'
import styled from 'styled-components'
export type ITextButtonProps = {
  disabled?: boolean | false
  iconRight?: ReactNode
  iconLeft?: ReactNode
  width?: number | string
  children: string
  onClick?: () => void
}

export const TextButton = (props: ITextButtonProps) => {
  return (
    <StyledRow gutter='xs' justify='center' onClick={props.onClick}>
      {props.iconLeft &&
        <Col>
          <Icon
            name='chevron-right'
            size={12}
            color={theme.accent1}
          />
        </Col>
      }
      <Text weight='bold' size='sm' color='primary'>
        {props.children}
      </Text>
      {props.iconRight &&
        <Col>
          <Icon
            name='chevron-right'
            size={12}
            color={theme.accent1}
          />
        </Col>
      }
    </StyledRow>
  )
}

const StyledRow = styled(Row)`
  cursor: pointer;
`
