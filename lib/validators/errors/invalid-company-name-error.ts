import i18n from "@i18n";

export class InvalidCompanyNameError extends Error  {
  constructor(length: number) {
    super(i18n.t('error.invalid_company_name', {length}))
  }
}