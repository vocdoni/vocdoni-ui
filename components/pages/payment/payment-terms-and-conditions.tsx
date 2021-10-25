import React from 'react'
import styled from 'styled-components'
import Link from 'next/dist/client/link'
import { Trans, useTranslation } from 'react-i18next'

import { Card } from '@components/elements/cards'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from '@theme/colors'

import { TERMS_PATH } from '@const/routes'

export const PaymentTermsAndConditions = () => {
  const { i18n } = useTranslation()

  return (
    <Card>
      <Typography variant={TypographyVariant.H3}>
        {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions')}
      </Typography>

      <TermsAndConditionsList>
        <li>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.blueText}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_1')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.blueText}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_2')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.blueText}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_3')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.blueText}>
            {i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_4')}
          </Typography>
        </li>
        <li>
          <Typography variant={TypographyVariant.ExtraSmall} color={colors.blueText}>
            <Trans
              defaults={i18n.t('payment.payment_terms_and_conditions.terms_and_conditions_5')}
              components={[<Link href={TERMS_PATH}/>]}
            />
          </Typography>
        </li>
      </TermsAndConditionsList>
    </Card>
  )
}

const TermsAndConditionsList = styled.ul`
  margin-left: 0;
`
