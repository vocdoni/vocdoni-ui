import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Address, PaymentIntent } from '@stripe/stripe-js'
import { useTranslation } from 'react-i18next'
import { CardElement, useElements, useStripe } from '@stripe/react-stripe-js'

import { InputFormGroup, FormGroupVariant, SelectFormGroup } from '@components/blocks/form'
import { Subscription } from '@recoil/atoms/subscription'

import { Button } from '@components/elements/button'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { colors } from '@theme/colors'
import { ISelectOption } from '@components/elements/inputs'
import { Card } from '@components/elements/cards'
import { enCountries, esCountries } from '@const/countries'

interface IPaymentFormProps {
  subscription: Subscription
  onSubmit: (data: PaymentIntent) => void
}

export interface IBillingDetails {
  name: string
  taxId: string
  address: Address
}

export enum PaymentFormField {
  name = 'name',
  taxId = 'taxId',
  country = 'country',
  city = 'city',
  postalCode = 'postal_code',
  line1 = 'line1',
  card = 'card',
}

export const PaymentForm = ({ subscription, onSubmit }: IPaymentFormProps) => {
  const { i18n } = useTranslation()
  const stripe = useStripe()
  const elements = useElements()
  const [paymentError, setPaymentError] = useState<string>(null)
  const [checkingPayment, setCheckingPayment] = useState<boolean>(false)
  const [countryList, setCountryList] = useState<ISelectOption[]>([])
  const [billingData, setBillingData] = useState<IBillingDetails>({
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

  useEffect(() => {
    console.log(i18n)
    let langCountryList = i18n.language === 'es' ? esCountries : enCountries

    const countryList = langCountryList.map((country) => ({
      label: country.name,
      value: country.alpha2,
    }))

    setCountryList(countryList)
  }, [])

  const handleAddressChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    setBillingData({
      ...billingData,
      address: {
        ...billingData.address,
        [name]: value,
      },
    })
  }

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const clientSecret = subscription?.clientSecret
    const cardElement = elements.getElement(CardElement)
    setCheckingPayment(true)

    try {
      let { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: cardElement,
          billing_details: billingData,
        },
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target
    console.log(name, value)
    setBillingData({
      ...billingData,
      [name]: value,
    })
  }

  const selectedCountry = countryList?.find((country) => country.value === billingData.address.country)
  return (
    <Card>
      <FormField>
        {paymentError && (
          <Typography variant={TypographyVariant.Small} color={colors.danger}>
            {paymentError}
          </Typography>
        )}
        <form onSubmit={handleSubmit}>
          <InputFormGroup
            onChange={handleChange}
            name={PaymentFormField.name}
            value={billingData.name}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.name')}
            placeholder={i18n.t('payment.payment_form.insert_personal_or_company_name')}
          />

          <InputFormGroup
            onChange={handleChange}
            name={PaymentFormField.taxId}
            value={billingData.taxId}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.tax_number')}
            placeholder={i18n.t('payment.payment_form.insert_tax_number')}
          />

          <SelectFormGroup
            onChange={(option: ISelectOption) => {
              setBillingData({
                ...billingData,
                address: {
                  ...billingData.address,
                  country: option.value as string,
                },
              })
            }}
            name={PaymentFormField.country}
            value={selectedCountry}
            options={countryList}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.country')}
            placeholder={i18n.t('payment.payment_form.insert_personal_or_company_name')}
          />

          <InputFormGroup
            onChange={handleAddressChange}
            name={PaymentFormField.city}
            value={billingData.address.city}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.city')}
          />

          <InputFormGroup
            onChange={handleAddressChange}
            name={PaymentFormField.postalCode}
            value={billingData.address.postal_code}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.zip_code')}
          />

          <InputFormGroup
            onChange={handleAddressChange}
            name={PaymentFormField.line1}
            value={billingData.address.line1}
            variant={FormGroupVariant.Small}
            label={i18n.t('payment.payment_form.street')}
          />

          <CardContainer>
            <CardElement />
          </CardContainer>

          <SkipButtonContainer>
            <Button type="submit" spinner={checkingPayment} wide positive>
              {i18n.t('payment.payment_form.skip')}
            </Button>
          </SkipButtonContainer>
        </form>
      </FormField>
    </Card>
  )
}

const CardContainer = styled.div`
  margin-bottom: 20px;
`

const SkipButtonContainer = styled.div`
  margin-top: 20px;
  max-width: 200px;
`

const FormField = styled.fieldset`
  border: none;
  padding: 0;
  margin: 0;
  margin: 10px 0;
`
