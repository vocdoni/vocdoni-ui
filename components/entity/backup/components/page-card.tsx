import React, { ReactNode } from 'react'

import i18n from '@i18n'

import {
  PageCard,
  PageCardHeader,
  PageCardHeaderVariant,
} from '@components/cards'
import { MainDescription, MainTitle } from '@components/text'

interface IBackupPageCardProps {
  children: ReactNode
}
export const AccountBackupPageCard = ({ children }: IBackupPageCardProps) => (
  <PageCard>
    <PageCardHeader variant={PageCardHeaderVariant.Text}>
      <MainTitle>{i18n.t('backup.download_credentials')}</MainTitle>
      <MainDescription>
        {i18n.t('backup.protect_your_account_and_export_it_in_a_safe_way')}
      </MainDescription>
    </PageCardHeader>

    {children}
  </PageCard>
)
