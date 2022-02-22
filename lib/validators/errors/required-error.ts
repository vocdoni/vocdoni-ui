import i18n from '@i18n'

export class RequiredError extends Error {
  constructor() {
    super(i18n.t('error.required_field'))
  }
}
