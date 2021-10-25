import React, { useState } from 'react'
import { PaymentIntent } from '@stripe/stripe-js'
import { useElements, useStripe, PaymentElement } from '@stripe/react-stripe-js'


import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'
import { Product } from '@models/Product'
import { Subscription } from '@models/Subscription'
import { Button } from '@components/elements/button'
import { IBillingData } from './payment-form-invoice-data'

interface IPaymentFormCheckoutProps {
  onSubmit: (intent: PaymentIntent) => void
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
  const stripe = useStripe()
  const elements = useElements()


  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const cardElement = elements.getElement(PaymentElement)
    setCheckingPayment(true)

    try {
      let { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        // payment_method: {
        //   card: cardElement,
        //   billing_details: billingData,
        // },
      })

      if (error) {
        setPaymentError(error.message)
        return
      }
      console.log('El pago esta bien', paymentIntent)
      onSubmit(paymentIntent)
    } finally {
      setCheckingPayment(false)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.ExtraSmall}>
            {i18n.t('payment_form.payment_form_checkout.base_price')}
          </Typography>

          <Typography variant={TypographyVariant.ExtraSmall}>EUR {product.priceEuro}</Typography>
        </FlexContainer>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <Typography variant={TypographyVariant.ExtraSmall}>
            {i18n.t('payment.payment_detail.added_cost_extra_members')}
          </Typography>
          <Typography variant={TypographyVariant.ExtraSmall}>
            EUR {Product.getPriceInEuro(product.getExtraVotersPrice(quantity), 2)}
          </Typography>
        </FlexContainer>

        <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
          <FlexContainer>
            <Typography variant={TypographyVariant.Small}>{i18n.t('payment.payment_detail.subtotal')}</Typography>
            <Typography variant={TypographyVariant.ExtraSmall}>
              ({i18n.t('payment.payment_detail.excluding_tax')})
            </Typography>
          </FlexContainer>
          <Typography variant={TypographyVariant.Small}>
            EUR {Product.getPriceInEuro(product.getTotalPrice(quantity), 2)}
          </Typography>
        </FlexContainer>
      </div>

      <div>
        <Typography variant={TypographyVariant.Body2}>
          {i18n.t('payment.payment_detail.insert_your_card_details')}
        </Typography>

          <PaymentElement />
      </div>

      <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
        <Button onClick={onBack}>{i18n.t('payment.payment_form_checkout.back')}</Button>
      </FlexContainer>
    </form>
  )
}
