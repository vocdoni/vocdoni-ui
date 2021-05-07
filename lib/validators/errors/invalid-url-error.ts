import i18n from "@i18n";

export class InvalidUrlError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_url'))
  }
}