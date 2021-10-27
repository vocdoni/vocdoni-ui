import React, { useState } from 'react'
import { PaymentIntent } from '@stripe/stripe-js'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'
import styled from 'styled-components'

import { FlexAlignItem, FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'
import { Product } from '@models/Product'
import { Button } from '@components/elements/button'
import { IBillingData } from './payment-form-invoice-data'
import RouterService from '@lib/router'
import { PAYMENT_SUCCESS_PAGE } from '@const/routes'
import { Spinner } from '@components/elements/spinner'

interface IPaymentFormCheckoutProps {
  onSubmit: (intent: any) => void
  onBack: () => void
  product: Product
  billingData: IBillingData
  quantity: number
}

export const PaymentFormCheckout = ({
  onSubmit,
  onBack,
  product,
  billingData,
  quantity,
}: IPaymentFormCheckoutProps) => {
  const { i18n } = useTranslation()
  const [paymentError, setPaymentError] = useState<string>(null)
  const [checkingPayment, setCheckingPayment] = useState<boolean>(false)
  const [componentMounted, setComponentMounted] = useState<boolean>(false)
  const stripe = useStripe()
  const elements = useElements()

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cardElement = elements.getElement(PaymentElement)
    setCheckingPayment(true)

    try {
      let result = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: RouterService.instance.get(PAYMENT_SUCCESS_PAGE, {}),
        },
      })

      if (result.error) {
        setPaymentError(result.error.message)
        return
      }
      console.log('El pago esta bien', result)
      onSubmit(result)
    } finally {
      setCheckingPayment(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.ExtraSmall}>
            {i18n.t('payment.payment_form_checkout.base_price')}
          </Typography>

          <Typography variant={TypographyVariant.ExtraSmall}>EUR {product.priceEuro}</Typography>
        </FlexContainer>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.ExtraSmall}>
            {i18n.t('payment.payment_form_checkout.added_cost_extra_members')}
          </Typography>
          <Typography variant={TypographyVariant.ExtraSmall}>
            EUR {Product.getPriceInEuro(product.getExtraVotersPrice(quantity), 2)}
          </Typography>
        </FlexContainer>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <FlexContainer>
            <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_form_checkout.subtotal')}</Typography>
            <Typography variant={TypographyVariant.ExtraSmall}>
              ({i18n.t('payment.payment_form_checkout.excluding_tax')})
            </Typography>
          </FlexContainer>
          <Typography variant={TypographyVariant.Small}>
            EUR {Product.getPriceInEuro(product.getTotalPrice(quantity), 2)}
          </Typography>
        </FlexContainer>
      </div>

      <div>
        <Typography variant={TypographyVariant.Body2}>
          {i18n.t('payment.payment_form_checkout.insert_your_card_details')}
        </Typography>

        <PaymentElementContainer>
          {!componentMounted && <PaymentElementLoader><FlexContainer justify={FlexJustifyContent.Center} alignItem={FlexAlignItem.Center}><Spinner size="40px"/></FlexContainer></PaymentElementLoader>}
          <PaymentElement onReady={() => setComponentMounted(true)} />
        </PaymentElementContainer>
      </div>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Button onClick={onBack}>{i18n.t('payment.payment_form_checkout.back')}</Button>
      </FlexContainer>
    </form>
  )
}

const PaymentElementContainer = styled.div`
  min-height: 300px;
  margin-bottom: 20px;
  position: relative;
`

const PaymentElementLoader = styled.div`
position: absolute;
  min-height: 300px;
  display: flex;
  justify-content: center;
  align-items: center;
`
