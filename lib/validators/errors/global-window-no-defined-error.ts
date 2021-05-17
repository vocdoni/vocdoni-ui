import i18n from '@i18n'

export class GlobalWindowNoDefinedError extends Error {
  constructor() {
    super(i18n.t("errors.the_global_window_element_is_not_defined"))
  }
}
