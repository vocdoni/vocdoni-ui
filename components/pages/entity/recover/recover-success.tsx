import React from 'react'

import i18n from '@i18n'

import { SuccessCard } from '../components/success-card'

export const AccountRecoveredSuccess = () => (
  <SuccessCard
    title={i18n.t('recover.reset_your_passphrase')}
    subtitle={i18n.t('recover.drag_a_vocdoni_backup_file')}
    text={i18n.t('recover.your_account_has_been_recovered_successfully')}
  />
)
