import i18n from '@i18n'

export class EntityNameAlreadyExistError extends Error {
  constructor() {
    super(i18n.t("errors.there_is_already_one_account_with_the_same_name"))
  }
}
