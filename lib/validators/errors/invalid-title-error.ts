import i18n from "@i18n";

export class InvalidTitleError extends Error  {
  constructor(length: number) {
    super(i18n.t('error.invalid_title', {length}))
  }
}