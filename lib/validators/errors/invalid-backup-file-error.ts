import i18n from '@i18n'

export class InvalidBackupFileError extends Error {
  constructor() {
    super(i18n.t('error.invalid_back_up_file_error'))
  }
}
