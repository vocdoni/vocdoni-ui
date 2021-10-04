import React, { useState } from 'react'
import styled from 'styled-components'
import Close from 'remixicon/icons/System/close-line.svg'

import { useTranslation } from 'react-i18next'

import { Grid, Column } from '@components/elements/grid'

import { Product } from '@models/Product'

import { AmountSelector } from './amount-selector'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'

interface ICheckingCardProps {
  product: Product
  onClose: () => void
}

export const CheckingCard = ({ product, onClose }: ICheckingCardProps) => {
  const { i18n } = useTranslation()
  const [members, setMembers] = useState(1000)
  const handleChangeQuantity = () => {}

  return (
    <CheckingCardContainer>
      <CardHr />
      <CheckingCardWrapper>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween} alignItem={FlexAlignItem.Center}>
          <Typography variant={TypographyVariant.H3}>{i18n.t('pricing.checking_card.calculate_total_cost_of_your_plan')}</Typography>
          <CloseButton onClick={onClose}>
            <Close  width="30px"/>
          </CloseButton>
        </FlexContainer>

        <Grid>
          <Column sm={12} md={7}>
            <AmountSelector product={product} onChange={handleChangeQuantity} />
          </Column>
        </Grid>
      </CheckingCardWrapper>
    </CheckingCardContainer>
  )
}

const CardHr = styled.hr`
  position: absolute;
  width: 100%;
  border-top: solid 2px ${({theme}) => theme.lightBorder}
`

const CheckingCardContainer = styled.div`
  margin-top: -26px;
`

const CloseButton = styled.div`
  height: 40px;
  width: 40px;
  cursor: pointer;
`

const CheckingCardWrapper = styled.div`
  padding: 20px 0;
`
