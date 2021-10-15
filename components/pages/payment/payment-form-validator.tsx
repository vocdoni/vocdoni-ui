import { Validation } from '@lib/validators'
import { entityNameValidator } from '@lib/validators/entity-name-validator'
import { taxIdValidator } from '@lib/validators/tax-id-validator'
import { countryValidator } from '@lib/validators/country-validator'
import { cityValidator } from '@lib/validators/city-validator'



import { PaymentFormField, IBillingDetails } from './payment-form'
import { postalCodeValidator } from '@lib/validators/postal-code-validator'

export const validatePaymentForm = (billingDetails: IBillingDetails) => {
  const formValidation: Map<PaymentFormField, Validation> = new Map([
    [
      PaymentFormField.name,
      {
        argument: billingDetails.name,
        validator: entityNameValidator,
      },
    ],
    [
      PaymentFormField.taxId,
      {
        argument: billingDetails.taxId,
        validator: taxIdValidator,
      },
    ],
    [
      PaymentFormField.country,
      {
        argument: billingDetails.address.country,
        validator: countryValidator,
      },
    ],
    [
      PaymentFormField.city,
      {
        argument: billingDetails.address.city,
        validator: cityValidator,
      },
    ],
    [
      PaymentFormField.postalCode,
      {
        argument: billingDetails.address['postal_code'],
        validator: postalCodeValidator,
      },
    ],
  ])
}
