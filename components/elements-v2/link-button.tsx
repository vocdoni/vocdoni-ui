import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexContainerProps } from '@components/elements/flex'
import { colors } from '@theme/colors'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { Card } from './card'
import { Text } from './text'
import { Row, Col } from './grid'

type ILinkButtonProps = {
  icon?: ReactNode
  hideLinkIcon?: boolean
  /**
   * Children Prop
   */
  children: string
  href: string
  target: '_self' | '_blank'
}

export const LinkButton = (props: ILinkButtonProps) => {
  const i18n = useTranslation()
  const linkIcon = (
    <img
      src="/images/vote/link.svg"
      alt={i18n.t('vote.question_image_alt')}
    />
  )
  return (
    <Anchor href={props.href} target={props.target}>
      <Card hover padding='xs'>
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
              {linkIcon}
            </Col>
          }
        </Row>
      </Card>
    </Anchor>
  )
}

const Anchor = styled.a`
  display: flex;
  text-decoration: none;
`

// const
