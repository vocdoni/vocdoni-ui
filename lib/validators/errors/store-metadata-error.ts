import i18n from '@i18n'

export class StoreMetadataError extends Error {
  constructor() {
    super(i18n.t("errors.the_account_metadata_could_not_be_stored"))
  }
}
