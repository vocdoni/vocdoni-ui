import i18n from '@i18n'

export class InvalidAccountBalanceError extends Error {
  constructor() {
    super(i18n.t("errors.invalid_account_balance"))
  }
}
