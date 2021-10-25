import React from 'react'

import { useTranslation } from 'react-i18next'

import { Card } from '@components/elements/cards'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Product } from '@models/Product'
import { UNLIMITED } from '@const/products'

interface IPaymentDetailProps {
  product: Product
  quantity: number
}

export const PaymentDetail = ({ product, quantity }: IPaymentDetailProps) => {
  const { i18n } = useTranslation()

  return (
    <Card>
      <Typography variant={TypographyVariant.H3} margin="4px 0">
        {i18n.t('payment.payment_detail.plan_details')}
      </Typography>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Body2}>{i18n.t('payment.payment_detail.community_plan')}</Typography>
        <Typography variant={TypographyVariant.Body2}>{i18n.t('payment.payment_detail.billed_yearly')}</Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_detail.voting_processes')}</Typography>
        <Typography variant={TypographyVariant.Small}>
          {product && product.features.votingPerYear == UNLIMITED
            ? i18n.t('payment.payment_detail.unlimited')
            : product.features.votingPerYear}
        </Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_detail.questions_year')}</Typography>
        <Typography variant={TypographyVariant.Small}>
          {product && product.features.processes == UNLIMITED
            ? i18n.t('payment.payment_detail.unlimited')
            : product.features.processes}
        </Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_detail.base_price')}</Typography>
        <Typography variant={TypographyVariant.Small}>
          EUR { product.priceEuro }
        </Typography>
      </FlexContainer>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_detail.added_cost_extra_members')}</Typography>
        <Typography variant={TypographyVariant.Small}>
          EUR {Product.getPriceInEuro(product.getExtraVotersPrice(quantity), 2)}
        </Typography>
      </FlexContainer>
    </Card>
  )
}
