import i18n from '@i18n'

export class CreateCredentialsError extends Error {
  constructor() {
    super(i18n.t("errors.creating_credentials"))
  }
}
