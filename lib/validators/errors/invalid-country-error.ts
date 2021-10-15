import i18n from '@i18n'

export class InvalidCountryError extends Error {
  constructor() {
    super(i18n.t('error.invalid_country_error'))
  }
}
