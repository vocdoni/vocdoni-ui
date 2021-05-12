import i18n from '@i18n'

export class PassphraseNoMatchError extends Error {
  constructor() {
    super(i18n.t('error.the_passphrase_dont_match'))
  }
}
