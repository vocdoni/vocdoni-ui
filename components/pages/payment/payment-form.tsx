import React, { useState } from 'react';
import styled from 'styled-components'
import { Address, PaymentIntent } from '@stripe/stripe-js';
import { useTranslation } from 'react-i18next';
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js';

import { InputFormGroup, FormGroupVariant } from '@components/blocks/form';
import { Subscription } from '@recoil/atoms/subscription'

import { Button } from '@components/elements/button';
import { Typography, TypographyVariant } from '@components/elements/typography';
import { colors } from '@theme/colors';

interface IPaymentFormProps {
  subscription: Subscription;
  onSubmit: (data: PaymentIntent) => void;
}

interface IBillingDetails {
  name: string
  address: Address
}


export const PaymentForm = ({ subscription, onSubmit }: IPaymentFormProps) => {
  const { i18n } = useTranslation()
  const stripe = useStripe();
  const elements = useElements();
  const [paymentError, setPaymentError] = useState<string>(null);
  const [checkingPayment, setCheckingPayment] = useState<boolean>(false);
  const [billingData, setBillingData] = useState<IBillingDetails>({
    name: '',
    address: {
      city: '',
      country: '',
      line1: '',
      line2: '',
      state: '',
      postal_code: ''
    }
  })

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setBillingData({
      ...billingData,
      address: {
        ...billingData.address,
        [name]: value,
      }
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const clientSecret = subscription?.clientSecret
    const cardElement = elements.getElement(CardElement);
    setCheckingPayment(true)

    try {
      let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingData
        }
      });

      if (error) {
        setPaymentError(error.message)
        return;
      }
      console.log('El pago esta bien', paymentIntent)
      onSubmit(paymentIntent)
    } finally {
      setCheckingPayment(false)
    }
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    console.log(name, value)
    setBillingData({
      ...billingData,
      [name]: value,
    })
  }

  return (

    <FormField>
      {paymentError && <Typography variant={TypographyVariant.Small} color={colors.danger}>{paymentError}</Typography>}
      <form onSubmit={handleSubmit}>
        <InputFormGroup
          onChange={handleChange}
          name='name'
          value={billingData.name}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.name')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name='country'
          value={billingData.address.country}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.country')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name='city'
          value={billingData.address.city}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.city')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name='postal_code'
          value={billingData.address.postal_code}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.zip_code')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name='line1'
          value={billingData.address.line1}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.street')}
        />

        <CardContainer>
          <CardElement />
        </CardContainer>

        <div>
          <Button type="submit" spinner={checkingPayment} wide positive>Pay</Button>
        </div>
      </form>
    </FormField>
  )
}

const CardContainer = styled.div`
  margin-bottom: 20px;
`

const FormField = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  max-width: 400px;
  margin: 0 auto;
`
