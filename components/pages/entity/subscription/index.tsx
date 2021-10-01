import React from 'react'
import { useTranslation } from 'react-i18next'

import { Subscription } from '@models/Subscription'

import { Card } from '@components/elements/cards'
import { CardTextHeader } from '@components/blocks/card/text-header'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Grid, Column } from '@components/elements/grid'
import { Button } from '@components/elements/button'
import { PRICING_PAGE } from '@const/routes'

interface ISubscriptionPageProps {
  subscription: Subscription
}

export const SubscriptionView = ({ subscription }: ISubscriptionPageProps) => {
  const { i18n } = useTranslation()
  console.log(subscription.product.name)
  return (<Card>
    <CardTextHeader title={i18n.t('subscription.header.title')} />

    <Grid>
      <Column sm={12} md={6}>
        <Typography variant={TypographyVariant.Body1}>{i18n.t('subscription.body.license', { licence: subscription.product.name })}</Typography>
        <Typography variant={TypographyVariant.Body1}>{i18n.t('subscription.body.price', { price: (subscription.amount / 100).toFixed(2) })}</Typography>
        <Typography variant={TypographyVariant.Body1}>{i18n.t('subscription.body.license_period', { start_date: subscription.startDate, end_date: subscription.endDate })}</Typography>
      </Column>

      <Column sm={12} md={6}>
        <Typography variant={TypographyVariant.Body1}>{i18n.t('subscription.body.more_plans', { status: subscription.status })}</Typography>
        <div>
          <Button positive href={PRICING_PAGE}>{i18n.t('subscription.body.upgrade')}</Button>
        </div>
      </Column>
    </Grid>
  </Card>)
}

