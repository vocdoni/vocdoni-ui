import { InvalidCompanyNameError } from "./errors/invalid-company-name-error"
import { InvalidCountryError } from "./errors/invalid-country-error"

const MIN_COUNTRY_LENGTH = 2

export const countryValidator = (country: string) => (
  country.length >= MIN_COUNTRY_LENGTH? null: new InvalidCountryError()
)