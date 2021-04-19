import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'

import { CREATE_PROPOSAL_PATH } from '../../const/routes'
import { Button } from '../button'

import { Card } from '../cards'
import { SectionText, TextAlign } from '../text'

export const DashboardCreateProposalCard = () => (
  <Card md={4} sm={12}>
    <CreateProposalImageContainer>
      <img src="/images/dashboard/create-proposal.png"></img>
    </CreateProposalImageContainer>

    <SectionText align={TextAlign.Center}>
      {i18n.t('dashboard.create_new_proposal_in_only_5_minutes')}
    </SectionText>

    <CreateProposalButtonContainer>
      <Button href={CREATE_PROPOSAL_PATH} positive>
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
`
