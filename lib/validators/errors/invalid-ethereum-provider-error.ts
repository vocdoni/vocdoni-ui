import i18n from "@i18n";

export class InvalidEthereumProviderError extends Error  {
  constructor() {
    super(i18n.t('error.invalid_ethereum_provider'))
  }
}