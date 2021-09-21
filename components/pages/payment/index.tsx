import React from 'react';
import { useRecoilState } from 'recoil';

import { Product } from '@models/Product';

import { Column, Grid } from '@components/elements/grid';
import { Subscription } from '@recoil/atoms/subscription';
import { PaymentIntent } from '@stripe/stripe-js';

import { PaymentBox } from './payment-box';
import { PaymentForm } from './payment-form';

interface IPaymentViewProps {
  product: Product,
  subscription: Subscription,
  onPaymentSubmit: (intent: PaymentIntent) => void,
}

export const PaymentView = ({ product, subscription, onPaymentSubmit }: IPaymentViewProps) => {


  const price = product
  return (
    <div>
      <h1>Payment</h1>

      <Grid>
        <Column md={6} sm={12}>
          {product && product.features && <PaymentBox product={product} subscription={subscription}/>}
        </Column>

        <Column md={6} sm={12}>
          <PaymentForm subscription={subscription} onSubmit={onPaymentSubmit} />
        </Column>
      </Grid>
    </div>
  );
}