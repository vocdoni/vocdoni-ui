import React, { useState } from 'react'
import styled from 'styled-components'

import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@components/elements/button'
import { Input } from '@components/elements/inputs'
import { ProgressBar } from '@components/elements/progress-bar'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import RouterService from '@lib/router'
import { PAYMENT_PAGE } from '@const/routes'

import { Product } from '@models/Product'

interface IAmountSelectorProps {
  product: Product
  onChange: (amount: number) => void
}
export const AmountSelector = ({ product, onChange }: IAmountSelectorProps) => {
  const { i18n } = useTranslation()
  const [members, setMembers] = useState(1000)

  return (
    <>
      <Typography variant={TypographyVariant.Body2}>
        <Trans
          defaults="pricing.checking_card.this_plan_has_members"
          values={{ members }}
          components={[<strong />]}
        />
      </Typography>
      <Typography variant={TypographyVariant.Small}>
        {i18n.t('pricing.checking_card.you_can_add_more_up_100000_members_by', {
          votePrice: product.pricePerVoterEuro,
          maxVoter: product.maxVoter,
        })}
      </Typography>

      <AmountSelectorContainer alignItem={FlexAlignItem.Center}>
        <InputContainer>
          <Typography variant={TypographyVariant.Small} margin="0 0 10px 0">
            {i18n.t('pricing.checking_card.change_membership')}
          </Typography>

          <Input type="number" value={members.toFixed(0)} onChange={(e) => setMembers(parseInt(e.target.value))} />
        </InputContainer>

        <ButtonSection>
          <Typography variant={TypographyVariant.Small} margin="0 0 10px 0">
            {i18n.t('pricing.checking_card.adjust_membership_tier_to_get_the_best_value')}
          </Typography>

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
        </ButtonSection>
      </AmountSelectorContainer>

      <ProgressBarContainer>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('pricing.checking_card.members_in_your_plan')}
          </Typography>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('pricing.checking_card.max', { max: product.maxVoter })}
          </Typography>
        </FlexContainer>
        <ProgressBar value={members} max={product.lastTier.upTo} />
      </ProgressBarContainer>
    </>
  )
}

const AmountSelectorContainer = styled.div`
  padding: 20px 0;
  display: flex;
  align-items: center;
`

const ProgressBarContainer = styled.div`
  width: 100%;
`

const InputContainer = styled.div`
  max-width: 172px;
`
const ButtonSection = styled.div`
  margin-left: 20px;
`
const ButtonContainer = styled.div`
  display: inline-block;
  margin: 5px 10px 10px 0;

  button {
    margin-right: 10px;
  }
`
