import i18n from '@i18n'

export class InvalidPassphraseError extends Error {
  constructor() {
    super(i18n.t('error.invalid_passphrase_error'))
  }
}
