import i18n from '@i18n'

export class InvalidMnemonicError extends Error {
  constructor() {
    super(i18n.t('error.invalid_mnemonic_error'))
  }
}
