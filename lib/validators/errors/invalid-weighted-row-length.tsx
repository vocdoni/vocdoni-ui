import i18n from '@i18n'

export class InvalidWeightedRow extends Error {
  constructor(errorRows: number[]) {
    super(
      i18n.t('error.invalid_weighted_row_length', { invalidRows: errorRows.join(', ') })
    )
  }
}
