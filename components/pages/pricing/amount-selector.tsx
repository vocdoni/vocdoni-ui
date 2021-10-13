import React, { useState, useEffect } from 'react'
import styled from 'styled-components'

import { Trans, useTranslation } from 'react-i18next'

import { Button } from '@components/elements/button'
import { Input } from '@components/elements/inputs'
import { ProgressBar } from '@components/elements/progress-bar'
import { TextAlign, Typography, TypographyVariant } from '@components/elements/typography'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'

import { Product } from '@models/Product'
import { Card } from '@components/elements/cards'

interface IAmountSelectorProps {
  product: Product
  voters: number
  onChange: (amount: number) => void
}

export const AmountSelector = ({ product, voters, onChange }: IAmountSelectorProps) => {
  const { i18n } = useTranslation()
  const [selectedTier, setSelectedTier] = useState(product.price.payingTiers[0])

  useEffect(() => {
    setSelectedTier(product.price.payingTiers[0])
    onChange(product.price.payingTiers[0].fromTo)
  }, [product])
  console.log(!!product.getExtraVotersPrice(voters))
  return (
    <>
      <Typography variant={TypographyVariant.Body2}>
        <Trans
          defaults="pricing.checking_card.this_plan_has_members"
          values={{ members: selectedTier.fromTo }}
          components={[<strong />]}
        />
      </Typography>
      <Typography variant={TypographyVariant.Small}>
        {i18n.t('pricing.checking_card.you_can_add_more_up_100000_members_by', {
          votePrice: product.pricePerVoterEuro,
          maxVoter: product.maxVoters,
        })}
      </Typography>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <AmountSelectorContainer>
          <Typography variant={TypographyVariant.Small} margin="0 0 10px 0" align={TextAlign.Center}>
            {i18n.t('pricing.checking_card.change_membership')}
          </Typography>

          <ButtonSection>
            <AmountButtonContainer>
              <Button
                wide
                onClick={() => {
                  if (voters > product.features.baseMembers) onChange(voters - 1)
                }}>
                -
              </Button>
            </AmountButtonContainer>
            <InputContainer>
              <Input
                type="number"
                wide
                min={selectedTier.fromTo}
                max={selectedTier.upTo}
                value={voters}
                onChange={(e) => onChange(parseInt(e.target.value))}
              />
            </InputContainer>

            <AmountButtonContainer>
              <Button wide onClick={() => onChange(voters + 1)}>
                +
              </Button>
            </AmountButtonContainer>
          </ButtonSection>
          {/*
          <Typography variant={TypographyVariant.Small} margin="0 0 10px 0">
            {i18n.t('pricing.checking_card.adjust_membership_tier_to_get_the_best_value')}
          </Typography>

          <ButtonContainer>
            {product.price.payingTiers.map((tier, index) => (
              <Button
                key={index}
                positive={tier === selectedTier}
                onClick={() => {
                  onChange(tier.fromTo)
                  setSelectedTier(tier)
                }}
                // href={RouterService.instance.get(PAYMENT_PAGE, {
                //   productId: product.id,
                //   priceId: product.price.id,
                //   quantity: tier.upTo ? tier.upTo.toFixed() : '1000',
                // })
                // }
              >{`${tier.fromTo} - ${tier.upTo}`}</Button>
            ))}
          </ButtonContainer> 
        </ButtonSection>*/}
        </AmountSelectorContainer>

        <PricePerVoterContainer disabled={!product.getExtraVotersPrice(voters)}>
          <Typography variant={TypographyVariant.Small} margin="0 0 10px 0" align={TextAlign.Center}>
            {i18n.t('pricing.checking_card.added_cost')}
          </Typography>
          <PricePerVoterCard>
            <Typography variant={TypographyVariant.Body2} align={TextAlign.Center} margin="0">
              {Product.getPriceInEuro(product.getExtraVotersPrice(voters), 2)}€
            </Typography>
          </PricePerVoterCard>
        </PricePerVoterContainer>
      </FlexContainer>

      <ProgressBarContainer>
        <Typography variant={TypographyVariant.Body2}>
          {i18n.t('pricing.checking_card.members_in_your_plan')}
        </Typography>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('pricing.checking_card.min', { min: selectedTier.fromTo })}
          </Typography>

          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('pricing.checking_card.max', { max: selectedTier.upTo })}
          </Typography>
        </FlexContainer>

        <ProgressBar value={voters} min={0} max={selectedTier.upTo} />
      </ProgressBarContainer>
    </>
  )
}

const PricePerVoterContainer = styled.div<{ disabled: boolean }>`
  width: 172px;
  opacity: ${({ disabled }) => (disabled ? '0.5' : '1')};
`

const PricePerVoterCard = styled(Card)`
  padding: 9px 20px;
  border-radius: 6px;
`

const AmountSelectorContainer = styled.div`
  width: 340px;
`

const AmountButtonContainer = styled.div`
  max-width: 90px;
  width: 100%;
`

const ProgressBarContainer = styled.div`
  width: 100%;
`

const InputContainer = styled.div`
  margin: 0 10px;

  & > input {
    margin: 0;
    height: 43px;
    width: 140px;
    text-align: center;
  }
`

const ButtonSection = styled.div`
  & > * {
    display: inline-block;
  }
`
