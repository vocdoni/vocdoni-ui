import i18n from "@i18n";

export class InvalidDescriptionError extends Error  {
  constructor(length: number) {
    super(i18n.t('error.invalid_description', {length}))
  }
}