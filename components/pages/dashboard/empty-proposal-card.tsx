import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { Card } from '../../elements/cards'
import { FlexJustifyContent } from '../../elements/flex'
import { ImageContainer } from '../../elements/images'
import { SectionText, SectionTitle, TextAlign } from '../../elements/text'

export const EmptyProposalCard = () => {
  const { i18n } = useTranslation()
  return (
    <Card md={8} sm={12}>
      <EmptyProposalContainer>
        <div>
          <ImageContainer width="400px" justify={FlexJustifyContent.Center}>
            <img
              src="/images/dashboard/empty-proposal.jpg"
              alt={i18n.t('dashboard.no_proposals_yet')}
            />
          </ImageContainer>

          <NoProposalsTextContainer>
            <SectionTitle align={TextAlign.Center}>
              {i18n.t('dashboard.no_proposals_yet')}
            </SectionTitle>
            <SectionText align={TextAlign.Center}>
              {i18n.t('dashboard.no_proposals_yet_description')}
            </SectionText>
          </NoProposalsTextContainer>
        </div>
      </EmptyProposalContainer>
    </Card>
  )
}

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
