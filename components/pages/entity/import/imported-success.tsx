import React from 'react'
import { useTranslation } from 'react-i18next'

import { SuccessCard } from '../components/success-card'

export const AccountImportedSuccess = () => {
  const { i18n } = useTranslation()
  
  return (
  <SuccessCard
    title={i18n.t('import.import_an_account')}
    subtitle={i18n.t('import.select_the_backup_file_of_your_account')}
    text={i18n.t('import.your_account_has_been_imported_successfully')}
  />
  )
}
