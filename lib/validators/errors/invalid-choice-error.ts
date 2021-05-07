import i18n from '@i18n'

export class InvalidChoiceError extends Error {
  constructor(length: number) {
    super(i18n.t('error.invalid_choice_error', { length }))
  }
}
