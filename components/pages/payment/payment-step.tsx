import React from 'react'
import styled from 'styled-components' 
import { useTranslation } from 'react-i18next'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { RoundedCheck, RoundedCheckSize } from '@components/elements/rounded-check'

import { PaymentFormStep } from '.'

interface IPaymentStepProps {
  step: PaymentFormStep
}

export const PaymentStep = ({ step }: IPaymentStepProps) => {
  const { i18n } = useTranslation()

  return (
    <FlexContainer justify={FlexJustifyContent.SpaceBetween} alignItem={FlexAlignItem.Center}>
      <FlexContainer alignItem={FlexAlignItem.Center}>
        {step === PaymentFormStep.BillingData ? (
          <Typography variant={TypographyVariant.Body2}>1. </Typography>
        ) : (
          <RoundedCheck checked size={RoundedCheckSize.ExtraSmall} />
        )}
        <Typography variant={TypographyVariant.Body2} margin="0 0 0 10px">
          {i18n.t('payment.payment_form.invoice_details')}
        </Typography>
      </FlexContainer>
      <Separator />
      <FlexContainer alignItem={FlexAlignItem.Center}>
        <Typography variant={TypographyVariant.Body2}>2. </Typography>
        <Typography variant={TypographyVariant.Body2} margin="0 0 0 10px">
          {i18n.t('payment.payment_form.payment')}
        </Typography>
      </FlexContainer>
    </FlexContainer>
  )
}

const Separator = styled.div`
  border-top: 2px solid ${({ theme }) => theme.lightBorder};
  width: 100%;
  max-width: 200px;
`
