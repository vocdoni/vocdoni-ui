import { Card, Col, Row, Text, CardProps } from "@components/elements-v2"
import { colorsV2 } from "@theme/colors-v2"
import { theme } from "@theme/global"
import { ReactNode } from "react"
import { useTranslation } from "react-i18next"
import styled from "styled-components"

export interface BinaryCardProps {
  title: string
  subtitle?: string
  value: any
  onChange?: (boolean) => void
  children?: ReactNode
}
interface StyledCardProps extends CardProps {
  active: boolean
  positive?: boolean
}
export const BinaryCard = (props: BinaryCardProps) => {
  const i18n = useTranslation()
  return (
    <Card variant='outlined' padding='24px 40px'>
      <Row gutter="lg">
        <Col xs={12}>
          <Row align='center' >
            <Col xs={9}>
              <Row gutter='md'>
                <Col xs={12}>
                  <Text color='primary' weight='bold' size='lg' >
                    {props.title}
                  </Text>
                </Col>
                {props.subtitle &&
                  <Col xs={12}>
                    <Text color='light-gray' size='md' >
                      {props.subtitle}
                    </Text>
                  </Col>
                }
              </Row>
            </Col>
            <Col xs={3}>
              <Card variant="gray" padding="0">
                <Row gutter="none">
                  <Col xs={6} justify="center">
                    <StyledCard
                      active={!props.value}
                      padding="13px"
                      variant="outlined"
                      onClick={() => props.onChange(false)}
                    >
                      <Text align="center" size="sm" weight="bold">
                        {i18n.t('votes.new.no')}
                      </Text>
                    </StyledCard>
                  </Col>
                  <Col xs={6} justify="center">
                    <StyledCard
                      active={props.value}
                      positive
                      padding="13px"
                      variant="outlined"
                      onClick={() => props.onChange(true)}
                    >
                      <Text align="center" size="sm" weight="bold">
                        {i18n.t('votes.new.yes')}
                      </Text>
                    </StyledCard>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
        {(props.children && props.value) &&
          <Col xs={12}>
            {props.children}
          </Col>
        }
      </Row>
    </Card>
  )
}

const getBorderColor = (props: StyledCardProps) => {
  if (props.active && props.positive) {
    return theme.accent1
  }
  if (props.active) {
    return colorsV2.neutral[500]
  }
  return 'transparent'
}
const getTextColor = (props: StyledCardProps) => {
  if (props.active && props.positive) {
    return theme.accent1
  }
  if (props.active) {
    return colorsV2.neutral[500]
  }
  return theme.blueText
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
  color: ${getTextColor};
  cursor:pointer;
  border-radius: 8px;
  border-color: ${getBorderColor};
  background-color: ${getBackgroundColor};
`
