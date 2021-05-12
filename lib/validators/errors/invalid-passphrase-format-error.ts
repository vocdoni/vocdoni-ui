import i18n from '@i18n'

export class InvalidPassphraseFormatError extends Error {
  constructor(length: number) {
    super(i18n.t('error.invalid_passphrase_format_error', {length}))
  }
}
