import React, { useState, useEffect } from 'react'
import styled from 'styled-components'
import { Address } from '@stripe/stripe-js'
import { useTranslation } from 'react-i18next'

import { InputFormGroup, FormGroupVariant, SelectFormGroup } from '@components/blocks/form'

import { Button } from '@components/elements/button'

import { ISelectOption } from '@components/elements/inputs'
import { enCountries, esCountries } from '@const/countries'
import { validatePaymentForm } from './payment-form-validator'
import { ErrorFields } from '@lib/validators'

export enum PaymentFormField {
  name = 'name',
  taxId = 'taxId',
  country = 'country',
  city = 'city',
  postalCode = 'postal_code',
  line1 = 'line1',
  card = 'card',
}

export interface IBillingData {
  name: string
  taxId: string
  address: Address
}

interface IPaymentFormInvoiceDataProps {
  onSubmit: (billingDetails: IBillingData) => void
  initialData: IBillingData
}

export const PaymentFormInvoiceData = ({ onSubmit, initialData }: IPaymentFormInvoiceDataProps) => {
  const { i18n } = useTranslation()
  const [checkingPayment, setCheckingPayment] = useState<boolean>(false)
  const [hasFilledData, setHasFilledData] = useState<boolean>(false)
  const [dataError, setDataError] = useState<ErrorFields>(new Map())
  const [countryList, setCountryList] = useState<ISelectOption[]>([])
  const [billingData, setBillingData] = useState<IBillingData>(initialData)

  useEffect(() => {
    console.log(i18n)
    let langCountryList = i18n.language === 'es' ? esCountries : enCountries

    const countryList = langCountryList.map((country) => ({
      label: country.name,
      value: country.alpha2,
    }))

    setCountryList(countryList)
  }, [])

  useEffect(() => {
    if (!checkEmptyFields(billingData)) {
      setHasFilledData(true)
      const fieldErrors = validatePaymentForm(billingData)
      console.log(fieldErrors)
      setDataError(fieldErrors)
    } else if (hasFilledData && hasFilledData) {
      setHasFilledData(false)
    }
  }, [billingData])

  const checkEmptyFields = (fields): boolean => {
    for (let field in fields) {
      const fieldValue = fields[field]

      if (
        (typeof fieldValue === 'object' && !checkEmptyFields(fieldValue)) ||
        (typeof fieldValue !== 'object' && fieldValue)
      )
        return false
    }

    return true
  }

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

    if (hasFilledData && !!dataError.size) return

    try {
      onSubmit(billingData)
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
    <FormField>
      <form onSubmit={handleSubmit}>
        <InputFormGroup
          onChange={handleChange}
          name={PaymentFormField.name}
          value={billingData.name}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.payment_form.name')}
          error={hasFilledData && dataError.get(PaymentFormField.name)?.message}
          placeholder={i18n.t('payment.payment_form.insert_personal_or_company_name')}
        />

        <InputFormGroup
          onChange={handleChange}
          name={PaymentFormField.taxId}
          value={billingData.taxId}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.payment_form.tax_number')}
          error={hasFilledData && dataError.get(PaymentFormField.taxId)?.message}
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
          error={hasFilledData && dataError.get(PaymentFormField.country)?.message}
          placeholder={i18n.t('payment.payment_form.insert_personal_or_company_name')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name={PaymentFormField.city}
          value={billingData.address.city}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.payment_form.city')}
          error={hasFilledData && dataError.get(PaymentFormField.city)?.message}
          placeholder={i18n.t('payment.payment_form.insert_your_city')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name={PaymentFormField.line1}
          value={billingData.address.line1}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.payment_form.street')}
          error={hasFilledData && dataError.get(PaymentFormField.line1)?.message}
          placeholder={i18n.t('payment.payment_form.insert_your_address')}
        />

        <InputFormGroup
          onChange={handleAddressChange}
          name={PaymentFormField.postalCode}
          value={billingData.address.postal_code}
          variant={FormGroupVariant.Small}
          label={i18n.t('payment.payment_form.zip_code')}
          error={hasFilledData && dataError.get(PaymentFormField.postalCode)?.message}
          placeholder={i18n.t('payment.payment_form.insert_your_zip_code')}
        />

        <SkipButtonContainer>
          <Button type="submit" spinner={checkingPayment} wide positive disabled={hasFilledData && !!dataError.size}>
            {hasFilledData ? i18n.t('payment.payment_form.continue') : i18n.t('payment.payment_form.skip')}
          </Button>
        </SkipButtonContainer>
      </form>
    </FormField>
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
