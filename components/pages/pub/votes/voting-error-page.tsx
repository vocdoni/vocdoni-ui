import React from 'react'

import i18n from '@i18n'

import { PageCard } from '@components/elements/cards'
import { SectionText, SectionTitle, TextAlign } from '@components/elements/text'
import { FlexAlignItem, FlexContainer, FlexDirection, FlexJustifyContent } from '@components/elements/flex'

interface IVotingErrorPageProps {
  message: string
}

export const VotingErrorPage = ({ message }: IVotingErrorPageProps) => (
  <PageCard>
    <FlexContainer
      minHeight="400px"
      justify={FlexJustifyContent.Center}
      direction={FlexDirection.Column}
      alignItem={FlexAlignItem.Center}
    >
      <SectionTitle align={TextAlign.Center}>
        {i18n.t('vote.login_title')}
      </SectionTitle>

      <SectionText align={TextAlign.Center}>{message}</SectionText>
    </FlexContainer>
  </PageCard>
)
