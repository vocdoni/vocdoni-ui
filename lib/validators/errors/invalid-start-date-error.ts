import i18n from "@i18n";

export class InvalidStartDateError extends Error  {
  constructor() {
    super(i18n.t('errors.process.invalid_start_date'))
  }
}