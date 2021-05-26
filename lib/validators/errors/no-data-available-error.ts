import i18n from "@i18n";

export class NoDataAvailableError extends Error  {
  constructor() {
    super(i18n.t('error.the_vote_is_not_available_yet'))
  }
}