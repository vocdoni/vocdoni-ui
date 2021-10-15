import i18n from '@i18n'

export class InvalidPostalCodeError extends Error {
  constructor() {
    super(i18n.t('error.invalid_postal_code'))
  }
}
