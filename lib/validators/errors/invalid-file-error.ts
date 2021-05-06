import i18n from "@i18n";

export class InvalidFileError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_file'))
  }
}