import { FlexAlignItem, FlexContainer, FlexJustifyContent, FlexContainerProps } from '@components/elements/flex'
import { colors } from '@theme/colors'
import React, { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import { When } from 'react-if'
import Link from "next/link"
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
    <Container>
      <FlexContainer
        onClick={props.onClick}
        alignItem={FlexAlignItem.Center}
        justify={FlexJustifyContent.SpaceBetween}
      >
        {props.iconLeft && <Icon>{props.iconRight}</Icon>}
        {props.children}
        {props.iconRight && <Icon>{props.iconRight}</Icon>}
      </FlexContainer>
    </Container>
  )
}

const Container = styled.div`
  cursor: pointer;
  color: ${colors.accent1};
  font-family: Manrope;
  font-weight: 600;
  font-size: 16px;
`

const Icon = styled.div`
  margin: 0px 4px;
`
