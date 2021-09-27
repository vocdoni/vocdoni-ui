import i18n from "@i18n";

export class NoSubscriptionFoundError extends Error  {
  constructor() {
    super(i18n.t('error.no_subscription_found'))
  }
}