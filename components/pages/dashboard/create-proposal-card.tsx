import React from 'react'
import styled from 'styled-components'

import i18n from '../../../i18n'

import { CREATE_PROCESS_PATH } from '../../../const/routes'
import { Button } from '../../elements/button'

import { Card } from '../../elements/cards'
import { SectionText, TextAlign } from '../../elements/text'

export const DashboardCreateProposalCard = () => (
  <Card md={4} sm={12}>
    <CreateProposalImageContainer>
      <img src="/images/dashboard/create-proposal.png"></img>
    </CreateProposalImageContainer>

    <SectionText align={TextAlign.Center}>
      {i18n.t('dashboard.create_new_proposal_in_only_5_minutes')}
    </SectionText>

    <CreateProposalButtonContainer>
      <Button href={CREATE_PROCESS_PATH} positive>
        {i18n.t('dashboard.create_proposal')}
      </Button>
    </CreateProposalButtonContainer>
  </Card>
)

const CreateProposalImageContainer = styled.div`
  & > img {
    width: 100%;
  }
`
const CreateProposalButtonContainer = styled.div`
  text-align: center;
  padding-top: 10px;
  padding-bottom: 10px;
`
