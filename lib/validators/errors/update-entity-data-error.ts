import i18n from '@i18n'

export class UpdateEntityDataError extends Error {
  constructor() {
    super(i18n.t("errors.update_entity_data_error"))
  }
}
