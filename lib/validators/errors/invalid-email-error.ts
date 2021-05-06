import i18n from "@i18n";

export class InvalidEmailError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_email_address'))
  }
}