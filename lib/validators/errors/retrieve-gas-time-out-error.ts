import i18n from "@i18n";

export class RetrieveGasTimeOutError extends Error  {
  constructor(milliseconds: number) {
    super(i18n.t('error.retrieve_gas_time_out', {milliseconds}))
  }
}
