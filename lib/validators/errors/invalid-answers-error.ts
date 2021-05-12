import i18n from '@i18n'

export class InvalidAnswersError extends Error {
  constructor() {
    super(i18n.t('error.invalid_answers_error'))
  }
}
