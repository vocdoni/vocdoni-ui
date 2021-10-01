import React from 'react';

import { Product } from '@models/Product';
import { Subscription } from '@models/Subscription';

import { Column, Grid } from '@components/elements/grid';

import { PaymentIntent } from '@stripe/stripe-js';

import { PaymentBox } from './payment-box';
import { PaymentForm } from './payment-form';
import { Typography, TypographyVariant } from '@components/elements/typography';
import { useTranslation } from 'react-i18next';

interface IPaymentViewProps {
  product: Product,
  subscription: Subscription,
  onPaymentSubmit: (intent: PaymentIntent) => void,
}

export const PaymentView = ({ product, subscription, onPaymentSubmit }: IPaymentViewProps) => {
  const { i18n } = useTranslation()

  const price = product
  return (
    <Grid>
      <Column>
        <Typography variant={TypographyVariant.H2}>{i18n.t('payment.header.title')}</Typography>
        <Typography variant={TypographyVariant.Body1}>{i18n.t('payment.header.description')}</Typography>
      </Column>
      <Grid>
        <Column md={6} sm={12}>
          {product && product.features && <PaymentBox product={product} subscription={subscription}/>}
        </Column>

        <Column md={6} sm={12}>
          <PaymentForm subscription={subscription} onSubmit={onPaymentSubmit} />
        </Column>
      </Grid>
    </Grid>
  );
}