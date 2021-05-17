import i18n from "@i18n";

export class InvalidIncognitoModeError extends Error  {
  constructor() {
    super(i18n.t('error.the_incognito_mode_is_not_supported'))
  }
}