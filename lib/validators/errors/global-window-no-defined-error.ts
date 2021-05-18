import i18n from '@i18n'

export class GlobalWindowNoDefinedError extends Error {
  constructor() {
    super(i18n.t("errors.not_a_web_browser"))
  }
}
