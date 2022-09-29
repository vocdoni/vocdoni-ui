import React, { ReactNode } from 'react'

import {
  PageCard,
  PageCardHeader,
  PageCardHeaderVariant,
} from '@components/elements/cards'
import { MainDescription, MainTitle } from '@components/elements/text'

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
    <PageCardHeader variant={PageCardHeaderVariant.Text} isHeaderExpanded={false}>
      <MainTitle>{title}</MainTitle>

      <MainDescription>{subtitle}</MainDescription>
    </PageCardHeader>

    {children}
  </PageCard>
)
