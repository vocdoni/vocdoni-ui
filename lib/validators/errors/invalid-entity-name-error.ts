import i18n from "@i18n";

export class InvalidEntityNameError extends Error  {
  constructor(length: number) {
    super(i18n.t('error.invalid_entity_name', {length}))
  }
}