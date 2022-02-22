import i18n from '@i18n'

export class MaxLengthError extends Error {
  constructor(length: number) {
    super(i18n.t('error.max_length', { length }))
  }
}
