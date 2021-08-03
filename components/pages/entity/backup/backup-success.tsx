import React from 'react'
import { useTranslation } from 'react-i18next'


import { SuccessCard } from '../components/success-card'

export const AccountBackupSuccess = () => {
  const { i18n } = useTranslation()
  return (
    <SuccessCard
      title={i18n.t('backup.download_credentials')}
      subtitle={i18n.t('backup.protect_your_account_and_export_it_in_a_safe_way')}
      text={i18n.t(
        'entity.your_account_is_protected_store_file_safe_place'
      )}
    />
  )
}
