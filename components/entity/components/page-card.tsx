import React, { ReactNode } from 'react'

import {
  PageCard,
  PageCardHeader,
  PageCardHeaderVariant,
} from '@components/cards'
import { MainDescription, MainTitle } from '@components/text'

interface IBackupPageCardProps {
  title: string
  subtitle: string
  children: ReactNode
}
export const AccountBackupPageCard = ({
  title,
  subtitle,
  children,
}: IBackupPageCardProps) => (
  <PageCard>
    <PageCardHeader variant={PageCardHeaderVariant.Text}>
      <MainTitle>{title}</MainTitle>

      <MainDescription>{subtitle}</MainDescription>
    </PageCardHeader>

    {children}
  </PageCard>
)
