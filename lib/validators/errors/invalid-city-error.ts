import i18n from '@i18n'

export class InvalidCityError extends Error {
  constructor() {
    super(i18n.t('error.invalid_city_error'))
  }
}
