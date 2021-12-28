import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexContainerProps } from '@components/elements/flex'
import { colors } from '@theme/colors'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import Link from "next/link"
import styled from 'styled-components'

type ILinkButtonProps = {
  disabled?: boolean | false
  rightIcon?: ReactNode
  leftIcon?: boolean
  children: string
  onClick?: () => void
}

export const TextButton = (props: ILinkButtonProps) => {
  return (
    <Container>
    <FlexContainer onClick={props.onClick} alignItem={FlexAlignItem.Center}>
      <When condition={props.leftIcon !== undefined}>
        {props.leftIcon}
        <Spacer />
      </When>
      {props.children}
      <When condition={props.rightIcon !== undefined}>
        <Spacer />
        {props.rightIcon}
      </When>
    </FlexContainer>
    </Container>
  )
}

const Container = styled.div`
  cursor: pointer;
  color: ${colors.accent1};
`

const Text = styled.span`
  font-family: Manrope;
  font-weight: 600;
  font-size: 16px;
`
const Spacer = styled.div`
  margin: 0px 10px;
`
