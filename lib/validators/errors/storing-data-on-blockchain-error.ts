import i18n from '@i18n'

export class StoringDataOnBlockchainError extends Error {
  constructor() {
    super(i18n.t("errors.storing_data_on_blockchain"))
  }
}
