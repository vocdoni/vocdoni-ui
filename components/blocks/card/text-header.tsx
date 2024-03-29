import React from 'react'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { PageCardHeader, PageCardHeaderVariant } from '@components/elements/cards'

import { colors } from '@theme/colors'

interface CardTextHeader {
  title: string,
  subtitle?: string
}

export const CardTextHeader = ({ title, subtitle }: CardTextHeader) => (
  <PageCardHeader variant={PageCardHeaderVariant.Text} isHeaderExpanded={false}>
    <Typography variant={TypographyVariant.H1}>{title}</Typography>
    {subtitle && <Typography color={colors.accent1} margin='20px 0 0'>{subtitle}</Typography>}
  </PageCardHeader>
)
