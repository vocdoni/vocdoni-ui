import i18n from '@i18n'

export class InvalidRowLength extends Error {
  constructor(errorRows: number[]) {
    super(
      i18n.t('error.invalid_row_length', { invalidRows: errorRows.join(', ') })
    )
  }
}
