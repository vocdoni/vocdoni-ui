import React, { useState } from 'react'
import styled from 'styled-components'
import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@components/elements/button'
import { Card } from '@components/elements/cards'
import { Price, Product } from '@models/Product'
import { Column, Grid } from '@components/elements/grid'

import RouterService from '@lib/router'
import { PAYMENT_PAGE } from '@const/routes'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { FormGroupVariant, InputFormGroup } from '@components/blocks/form'
import { ProgressBar } from '@components/elements/progress-bar'

interface ICheckingCardProps {
  product: Product
}

export const CheckingCard = ({ product }: ICheckingCardProps) => {
  const { i18n } = useTranslation()
  const [members, setMembers] = useState(1000)
  const lastTier = product.lastTier

  return (
    <>
      <CardHr />
      <CheckingCardContainer>

        <Typography variant={TypographyVariant.Body2}>
          <Trans
            defaults="pricing.checking_card.calculate_total_cost_of_your_plan"
            values={{ members }}
            components={[<strong />]}
          />
        </Typography>
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('pricing.checking_card.calculate_total_cost_of_your_plan', {
            votePrice: product.price.unitAmount,
          })}
        </Typography>

        <FlexContainer alignItem={FlexAlignItem.Center}>
          <InputContainer>
            <InputFormGroup
              type="number"
              label={i18n.t('pricing.checking_card.change_membership')}
              value={members.toFixed(0)}
              variant={FormGroupVariant.Small}
              onChange={(e) => setMembers(parseInt(e.target.value))}
            />
          </InputContainer>

          <ButtonContainer>
            {product.price.tiers.map((tier, index) => (
              <Button
                key={index}
                positive
                href={RouterService.instance.get(PAYMENT_PAGE, {
                  productId: product.id,
                  priceId: product.price.id,
                  quantity: tier.upTo ? tier.upTo.toFixed() : '1000',
                })}>{`${i18n.t('pricing.checking_card.volume')}: ${tier.upTo}`}</Button>
            ))}
          </ButtonContainer>
        </FlexContainer>

        <ProgressBarContainer>
          <ProgressBar value={members} max={product.lastTier.upTo} />
        </ProgressBarContainer>
      </CheckingCardContainer>
    </>
  )
}
const CardHr = styled.hr`
  position: absolute;
`

const CheckingCardContainer = styled.div`
  padding: 20px 0;
`

const ProgressBarContainer = styled.div``
const InputContainer = styled.div`
  max-width: 172px;
`
const ButtonContainer = styled.div`
  display: inline-block;
  margin-left: 10px;

  button {
    margin-right: 10px;
  }
`
