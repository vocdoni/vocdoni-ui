import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'

import { Card } from '../cards'
import { FlexJustifyContent } from '../flex'
import { ImageContainer } from '../images'
import { SectionText, SectionTitle, TextAlign } from '../text'

export const EmptyProposalCard = () => (
  <Card md={8} sm={12}>
    <EmptyProposalContainer>
      <div>
        <ImageContainer width="400px" justify={FlexJustifyContent.Center}>
          <img
            src="/images/dashboard/empty-proposal.png"
            alt={i18n.t('dashboard.no_proposals_yet')}
          />
        </ImageContainer>

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

const NoProposalsTextContainer = styled.div`
  margin-top: 30px;
  max-width: 400px;
`
