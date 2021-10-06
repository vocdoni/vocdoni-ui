import React from 'react'
import { Trans, useTranslation } from 'react-i18next'

import { Product } from '@models/Product'

import { Card } from '@components/elements/cards'
import { Button } from '@components/elements/button'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'

import RouterService from '@lib/router'
import { PAYMENT_PAGE } from '@const/routes'

interface ICheckingCardSummaryProps {
  product: Product
  voters: number
}

export const CheckingCardSummary = ({ product, voters }: ICheckingCardSummaryProps) => {
  const { i18n } = useTranslation()
  const totalPrice = ((product.getExtraVotersPrice(voters) + product.lastTier.flatAmount) / 100).toFixed(2)

  return (
    <Card>
      <Typography variant={TypographyVariant.Body1}>
        {i18n.t('pricing.checking_card_summary.total_cost_per_year')}
      </Typography>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>{i18n.t('pricing.checking_card_summary.base_price')}</Typography>
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('pricing.checking_card_summary.euro', { price: product.priceEuro })}
        </Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('pricing.checking_card_summary.members_ship')}
        </Typography>
        <Typography variant={TypographyVariant.Small}>{voters}</Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>
          <Trans defaults={i18n.t('pricing.checking_card_summary.total_exp_tax')} components={[<strong />]} />
        </Typography>
        <Typography variant={TypographyVariant.Small}>
          {i18n.t('pricing.checking_card_summary.euro', { price: totalPrice })}
        </Typography>{' '}
      </FlexContainer>

      <Typography variant={TypographyVariant.ExtraSmall}>
        {i18n.t('pricing.checking_card_summary.try_this_plan_for_free_for_14_days')}
      </Typography>
      <Typography variant={TypographyVariant.ExtraSmall}>
        {i18n.t('pricing.checking_card_summary.cancel_subscription_at_any_time')}
      </Typography>

      <div>
        <Button
          positive
          wide
          href={RouterService.instance.get(PAYMENT_PAGE, {
            productId: product.id,
            priceId: product.price.id,
            quantity: voters.toString(),
          })}>
          {i18n.t('pricing.checking_card_summary.try_for_free')}
        </Button>
      </div>
    </Card>
  )
}
