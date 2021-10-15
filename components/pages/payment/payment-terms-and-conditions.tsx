import { Card } from '@components/elements/cards'
import { Typography, TypographyVariant } from '@components/elements/typography'
import React from 'react'

import { useTranslation } from 'react-i18next'

export const PaymentTermsAndConditions = () => {
  const { i18n } = useTranslation()

  return (
    <Card>
      <Typography variant={TypographyVariant.H3}>
        {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions')}
      </Typography>

      <ul>
        <li>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_1')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_2')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_3')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_4')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.Body2}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_5')}
          </Typography>
        </li>
      </ul>
    </Card>
  )
}
