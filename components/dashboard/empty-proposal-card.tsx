import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'

import { Card } from '../cards'
import { SectionText, SectionTitle, TextAlign } from '../text'

export const EmptyProposalCard = () => (
  <Card md={8} sm={12}>
    <EmptyProposalContainer>
      <div>
        <NoProposalsImageContainer>
          <img
            src="/images/dashboard/empty-proposal.png"
            alt={i18n.t('dashboard.no_proposals_yet')}
          />
        </NoProposalsImageContainer>

        <NoProposalsTextContainer>
          <SectionTitle align={TextAlign.Center}>
            {i18n.t('dashboard.no_proposals_yet')}
          </SectionTitle>
          <SectionText align={TextAlign.Center}>
            {i18n.t('dashboard.lorem_ipsum')}
          </SectionText>
        </NoProposalsTextContainer>
      </div>
    </EmptyProposalContainer>
  </Card>
)

const EmptyProposalContainer = styled.div`
  min-height: 650px;
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
`
const NoProposalsImageContainer = styled.div`
  max-width: 400px;
  width: 100%;
  margin: auto;

  & > img {
    width: 100%;
  }
`

const NoProposalsTextContainer = styled.div`
  margin-top: 30px;
  max-width: 400px;
`
