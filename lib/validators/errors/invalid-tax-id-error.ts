import i18n from "@i18n";

export class InvalidTaxIdError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_tax_id'))
  }
}