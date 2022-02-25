import React from 'react'
import { Row, Card, Col, Text, CardProps } from '@components/elements-v2'
import styled from 'styled-components'
import { theme } from '@theme/global'
import { colorsV2 } from '@theme/colors-v2'

interface SelectorButtonProps {
  onClick?: (e: any) => void
  options: Option[]
  value: any
}

type Option = {
  title: string
  subtitle?: string
  value: any
}
interface StyledCardProps extends CardProps {
  active: boolean
}
export const SelectorButton = (props: SelectorButtonProps) => {
  return (
    <Card variant='gray' padding='0'>
      <Row gutter='none'>
        {props.options.map((item) =>
          <Col xs={12 / props.options.length}>
            <StyledCard
              variant='outlined'
              padding='18px 12px'
              active={props.value === item.value}
              onClick={() => props.onClick(item.value)}
            >
              <Row gutter='xs'>
                <Col xs={12} justify='center'>

                  <Text
                    align='center'
                    size='md'
                    weight='bold'
                    // check if active to change the text color
                    color={props.value === item.value ? 'primary' : 'dark-gray'}
                  >
                    {item.title}
                  </Text>
                </Col>
                {item.subtitle &&
                  <Col xs={12} justify='center'>
                    <Text align='center' color='light-gray'>
                      {item.subtitle}
                    </Text>
                  </Col>
                }
              </Row>
            </StyledCard>
          </Col>
        )}
      </Row>
    </Card>
  )
}
const getBorderColor = (props: StyledCardProps) => {
  if (props.active) {
    return theme.accent1
  }
  return 'transparent'
}
const getShadow = (props: StyledCardProps) => {
  if (props.active) {
    return '0px 6px 25px rgba(65, 70, 85, 0.05)'
  }
  return ''
}
const getBackgroundColor = (props: StyledCardProps) => {
  if (props.active) {
    return colorsV2.neutral[0]
  }
  return colorsV2.neutral[50]
}

const StyledCard = styled(Card) <StyledCardProps>`
  box-shadow: ${getShadow};
  box-sizing: border-box;
  cursor:pointer;
  border-color: ${getBorderColor};
  background-color: ${getBackgroundColor};
`
