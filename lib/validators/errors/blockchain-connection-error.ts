import i18n from '@i18n'

export class BlockchainConnectionError extends Error {
  constructor() {
    super(i18n.t("errors.cannot_connect_to_the_blockchain"))
  }
}
