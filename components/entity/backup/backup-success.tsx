import React from 'react'

import i18n from '@i18n'

import { SuccessCard } from '../components/success-card'

export const AccountBackupSuccess = () => (
  <SuccessCard
    title={i18n.t('backup.download_credentials')}
    subtitle={i18n.t('backup.protect_your_account_and_export_it_in_a_safe_way')}
    text={i18n.t(
      'entity.your_account_is_protected_store_file_safe_place'
    )}
  />
)
