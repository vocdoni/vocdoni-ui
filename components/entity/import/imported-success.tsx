import React from 'react'

import i18n from '@i18n'

import { SuccessCard } from '../components/success-card'

export const AccountImportedSuccess = () => (
  <SuccessCard
    title={i18n.t('import.import_an_account')}
    subtitle={i18n.t('import.drag_a_vocdoni_backup_file')}
    text={i18n.t('import.your_account_has_been_imported_successfully')}
  />
)
