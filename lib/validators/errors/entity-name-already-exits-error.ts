import i18n from '@i18n'

export class EntityNameAlreadyExistError extends Error {
  constructor() {
    super(i18n.t("errors.the_entity_name_already_exits"))
  }
}
