import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Card } from './card'
import { Text } from './text'
import { Row, Col } from './grid'
import { ExternalLinkIcon } from '@components/elements-v2/icons'
type LinkButtonProps = {
  icon?: ReactNode
  hideLinkIcon?: boolean
  /**
   * Children Prop
   */
  children: string
  href: string
  target: '_self' | '_blank'
  disabled?: boolean
}
type StyledAnchorProps = {
  disabled: boolean
}
export const LinkButton = (props: LinkButtonProps) => {
  const i18n = useTranslation()
  return (
    <Anchor href={props.href} target={props.target} disabled={props.disabled}>
      <Card hover padding='xs' >
        <Row align='center' justify='space-between'>
          <Col>
            <Row align='center' gutter='md'>
              {props.icon &&
                <Col>
                  {props.icon}
                </Col>
              }
              <Col>
                <Text size='sm' color='dark-blue' weight='bold'>
                  {props.children}
                </Text>
              </Col>
            </Row>
          </Col>
          {!props.hideLinkIcon &&
            <Col>
              <ExternalLinkIcon />
            </Col>
          }
        </Row>
      </Card>
    </Anchor>
  )
}
const getOpacity = (props: StyledAnchorProps) => {
  if (props.disabled) {
    return 0.25
  }
  return 1
}
const getCursor = (props: StyledAnchorProps) => {
  if (props.disabled) {
    return 'not-allowed'
  }
  return 'pointer'
}
const getPointerEvents = (props: StyledAnchorProps) => {
  if (props.disabled) {
    return 'none'
  }
  return 'auto'
}

const Anchor = styled.a<StyledAnchorProps>`
  display: flex;
  text-decoration: none;
  opacity: ${getOpacity};
  cursor: ${getCursor};
  & > * {
    pointer-events: ${getPointerEvents};
  }
`
