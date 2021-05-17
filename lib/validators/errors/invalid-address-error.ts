import i18n from "@i18n";

export class InvalidAddressError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_address'))
  }
}