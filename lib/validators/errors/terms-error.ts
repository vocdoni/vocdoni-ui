import i18n from "@i18n";

export class TermsError extends Error  {
  constructor() {
    super(i18n.t('error.the_therms_must_be_checked'))
  }
}