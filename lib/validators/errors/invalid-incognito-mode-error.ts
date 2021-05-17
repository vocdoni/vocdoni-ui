import i18n from "@i18n";

export class InvalidIncognitoModeError extends Error  {
  constructor() {
    super(i18n.t('error.you_cant_use_incognito_mode_for_these_process'))
  }
}