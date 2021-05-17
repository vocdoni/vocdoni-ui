import i18n from '@i18n'

export class StoreMediaError extends Error {
  constructor() {
    super(i18n.t("errors.error_storing_logo_on_ipfs"))
  }
}
