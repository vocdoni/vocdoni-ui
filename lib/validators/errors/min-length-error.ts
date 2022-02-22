import i18n from '@i18n'

export class MinLengthError extends Error {
  constructor(length: number) {
    super(i18n.t('error.min_length', { length }))
  }
}
