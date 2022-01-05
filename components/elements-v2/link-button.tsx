import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexContainerProps } from '@components/elements/flex'
import { colors } from '@theme/colors'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import Link from "next/link"
import styled from 'styled-components'
import { Card } from './card'
import { Text } from './text'
import { Row, Col } from './grid'

type ILinkButtonProps = {
  disabled?: boolean | false
  icon?: ReactNode
  hideLinkIcon?: boolean
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
                <Text size='md' color='dark-blue' weight='bold'>
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
      {/* <LinkBtn alignItem={FlexAlignItem.Center} justify={FlexJustifyContent.SpaceBetween}>
        <FlexContainer alignItem={FlexAlignItem.Center}>
          <When condition={props.icon !== undefined}>
            {props.icon}
            <Spacer />
          </When>
          {props.children}
        </FlexContainer>
        {props.hideLinkIcon ? null : linkIcon}
      </LinkBtn> */}
    </Anchor>
  )
}

const Anchor = styled.a`
  display: flex;
`
const LinkBtn = styled(FlexContainer) <FlexContainerProps>`
  flex: 1;
  cursor: pointer;
  padding: 0px 24px;
  background: ${colors.white};
  border: 2px solid ${colors.lightBorder};
  box-sizing: border-box;
  box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
  font-family: Manrope;
  font-weight: 600;
  font-size: 16px;
  color: ${colors.blueText};
  height: 72px;
  transition: 0.3s;
  &:hover{
    background-color:${colors.lightBg};
  }
`
const Spacer = styled.div`
  margin: 0px 10px;
`

// const
