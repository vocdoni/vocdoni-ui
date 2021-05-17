import i18n from "@i18n";

export class UpdateDbAccountError extends Error  {
  constructor() {
    super(i18n.t('error.error_updating_db_account'))
  }
}