import React from 'react'

import { useTranslation } from 'react-i18next'

import { SuccessCard } from '../components/success-card'

export const AccountRecoveredSuccess = () => {
  const { i18n } = useTranslation()
  return (
    <SuccessCard
      title={i18n.t('recover.reset_your_passphrase')}
      subtitle={i18n.t('recover.drag_a_vocdoni_backup_file')}
      text={i18n.t('recover.your_account_has_been_recovered_successfully')}
    />
  )
}
