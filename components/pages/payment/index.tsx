import React, { useRef, useState } from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { loadStripe } from '@stripe/stripe-js'
import { Elements } from '@stripe/react-stripe-js'

import { STRIPE_PUB_KEY } from '@const/env'

import LeftArrow from 'remixicon/icons/System/arrow-left-line.svg'
import Cart from 'remixicon/icons/Finance/shopping-cart-2-line.svg'
import { Product } from '@models/Product'
import { Subscription } from '@models/Subscription'

import { Column, Grid } from '@components/elements/grid'

import { PaymentIntent } from '@stripe/stripe-js'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { Steps } from '@components/blocks/steps'
import { Button } from '@components/elements/button'
import { FlexContainer } from '@components/elements/flex'
import { colors } from '@theme/colors'
import { Card } from '@components/elements/cards'

import { PaymentDetail } from './payment-detail'
import { PaymentTermsAndConditions } from './payment-terms-and-conditions'
import { IBillingData, PaymentFormInvoiceData } from './payment-form-invoice-data'
import { PaymentFormCheckout } from './payment-form-checkout'
import { PaymentStep } from './payment-step'

interface IPaymentViewProps {
  product: Product
  quantity: number
  subscription: Subscription
  onPaymentSubmit: (intent: PaymentIntent) => void
}

export enum PaymentFormStep {
  BillingData,
  PaymentData,
}

export const PaymentView = ({ product, subscription, quantity, onPaymentSubmit }: IPaymentViewProps) => {
  const { i18n } = useTranslation()
  const [paymentStep, setPaymentStep] = useState<PaymentFormStep>(PaymentFormStep.BillingData)
  const stripePromise = loadStripe(STRIPE_PUB_KEY)

  const billingData = useRef<IBillingData>({
    name: '',
    taxId: '',
    address: {
      city: '',
      country: '',
      line1: '',
      line2: '',
      state: '',
      postal_code: '',
    },
  })

  const handleInvoiceDetailsData = (data: IBillingData) => {
    billingData.current = data
    setPaymentStep(PaymentFormStep.PaymentData)
  }


  const handlePaymentSubmit = (paymentIntent: PaymentIntent) => {
    onPaymentSubmit(paymentIntent)
  }

  const handleBack = () => {
    setPaymentStep(PaymentFormStep.BillingData)
  }

  const options = {
    clientSecret: subscription.clientSecret,
    appearance: {},
  }

  return (
    <div>
      <Grid>
        <Column sm={12} md={2}>
          <Button icon={<LeftArrow width="20px" />}>{i18n.t('payment.index.back')}</Button>
        </Column>

        <Column sm={12} md={8}>
          <Steps
            steps={[
              i18n.t('pricing.steps.select_plan'),
              i18n.t('pricing.steps.checkout'),
              i18n.t('pricing.steps.select_plan'),
            ]}
            activeIdx={1}
            showProgress={true}
          />
        </Column>
      </Grid>

      <FlexContainer>
        <CartIconContainer>
          <Cart width="36px" fill={colors.blueText} />
        </CartIconContainer>

        <Typography variant={TypographyVariant.H1} margin="0">
          {i18n.t('payment.index.checkout')}
        </Typography>
      </FlexContainer>

      <Grid>
        <Column sm={12} md={7}>
          <Card>
            <PaymentStep step={paymentStep} />

            {paymentStep === PaymentFormStep.BillingData && (
              <PaymentFormInvoiceData onSubmit={handleInvoiceDetailsData} initialData={billingData.current} />
            )}

            {paymentStep === PaymentFormStep.PaymentData && (
              <Elements stripe={stripePromise} options={options}>
                <PaymentFormCheckout
                  product={product}
                  quantity={quantity}
                  billingData={billingData.current}
                  onBack={handleBack}
                  onSubmit={handlePaymentSubmit}
                />
              </Elements>
            )}
          </Card>
        </Column>

        <Column sm={12} md={5}>
          <PaymentDetail product={product} quantity={quantity} />
          <PaymentTermsAndConditions />
        </Column>
      </Grid>

      <Grid>
        <Column md={6} sm={12}>
          {/* {product && product.features && <PaymentBox product={product} subscription={subscription}/>} */}
        </Column>

        <Column md={6} sm={12}></Column>
      </Grid>
    </div>
  )
}

const CartIconContainer = styled.div`
  margin-right: 20px;
`
