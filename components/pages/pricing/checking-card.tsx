import React, { useState } from 'react'
import styled from 'styled-components'
import Close from 'remixicon/icons/System/close-line.svg'

import { useTranslation } from 'react-i18next'

import { Grid, Column } from '@components/elements/grid'

import { Product } from '@models/Product'

import { AmountSelector } from './amount-selector'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'

import { CheckingCardSummary } from './checking-card-summary'

interface ICheckingCardProps {
  visible: boolean
  product: Product
  onClose: () => void
}

export const CheckingCard = ({ product, visible, onClose }: ICheckingCardProps) => {
  const { i18n } = useTranslation()
  const [voters, setVoters] = useState(0)

  const handleChangeQuantity = (selectedVoters) => {
    setVoters(selectedVoters)
  }

  return (
    <CheckingCardContainer visible={visible}>
      <CardHr visible={visible}/>
      <CheckingCardWrapper>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween} alignItem={FlexAlignItem.Center}>
          <Typography variant={TypographyVariant.H3}>
            {i18n.t('pricing.checking_card.calculate_total_cost_of_your_plan')}
          </Typography>
          <CloseButton onClick={onClose}>
            <Close width="30px" />
          </CloseButton>
        </FlexContainer>

        <Grid>
          <Column sm={12} md={7}>
            {product && <AmountSelector product={product} voters={voters} onChange={handleChangeQuantity} />}
          </Column>

          <Column sm={12} md={5}>
            {product && <CheckingCardSummary product={product} voters={voters} />}
          </Column>
        </Grid>
      </CheckingCardWrapper>

      <CardHr visible={visible}/>
    </CheckingCardContainer>
  )
}

const CardHr = styled.hr<{visible: boolean}>`
  position: absolute;
  width: 100%;
  border-top: solid 2px ${({ theme }) => theme.lightBorder};
  margin-left: -40px;
  display: ${({ visible }) => (visible ? 'visible' : 'none')};
`

const CheckingCardContainer = styled.div<{ visible: boolean }>`
  margin-top: -26px;
  margin-bottom: 30px;
  overflow: hidden;
  transition: all 0.3s ease-in-out;

  max-height: ${({ visible }) => (visible ? '900px' : '0px')};
`

const CloseButton = styled.div`
  height: 40px;
  width: 40px;
  cursor: pointer;
`

const CheckingCardWrapper = styled.div`
  padding: 20px 0;
`
