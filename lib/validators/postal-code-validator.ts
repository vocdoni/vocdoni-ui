import { InvalidPostalCodeError } from "./errors/invalid-postal-code-error"

const postalCodeRegexp = /\d{4}/

export const postalCodeValidator = (postalCode: string) => (
  postalCodeRegexp.test(postalCode)? null: new InvalidPostalCodeError()
)