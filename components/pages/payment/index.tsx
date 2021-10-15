import React from 'react'
import styled from 'styled-components'

import LeftArrow from 'remixicon/icons/System/arrow-left-line.svg'
import Cart from 'remixicon/icons/Finance/shopping-cart-2-line.svg'
import { Product } from '@models/Product'
import { Subscription } from '@models/Subscription'

import { Column, Grid } from '@components/elements/grid'

import { PaymentIntent } from '@stripe/stripe-js'

import { PaymentBox } from './payment-box'
import { PaymentForm } from './payment-form'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { useTranslation } from 'react-i18next'
import { Steps } from '@components/blocks/steps'
import { Button } from '@components/elements/button'
import { FlexContainer } from '@components/elements/flex'
import { colors } from '@theme/colors'
import { Card } from '@components/elements/cards'
import { PaymentDetail } from './payment-detail'
import { PaymentTermsAndConditions } from './payment-terms-and-conditions'

interface IPaymentViewProps {
  product: Product
  quantity: number
  subscription: Subscription
  onPaymentSubmit: (intent: PaymentIntent) => void
}

export const PaymentView = ({ product, subscription, quantity, onPaymentSubmit }: IPaymentViewProps) => {
  const { i18n } = useTranslation()
  const price = product
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
          <PaymentForm subscription={subscription} onSubmit={onPaymentSubmit} />
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
