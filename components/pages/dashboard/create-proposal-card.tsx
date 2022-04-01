import React from 'react'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'

import { CREATE_PROCESS_PATH } from '../../../const/routes'
import { Button } from '../../elements/button'

import { Card } from '../../elements/cards'
import { SectionText, TextAlign } from '../../elements/text'
import { useWallet } from '@hooks/use-wallet'
import { TrackEvents, useRudderStack } from '@hooks/rudderstack'

export const DashboardCreateProposalCard = () => {
  const { wallet } = useWallet()
  const { i18n } = useTranslation()
  const { trackEvent } = useRudderStack()

  const handleRuddlestackEvent = () => {
    trackEvent(TrackEvents.PROCESS_CREATION_BUTTON_CLICKED, {
      entity: wallet?.address,
    })
  }

  return (
    <Card md={4} sm={12}>
      <CreateProposalImageContainer>
        <img src="/images/dashboard/create-proposal.jpg"></img>
      </CreateProposalImageContainer>

      <SectionText align={TextAlign.Center}>
        {i18n.t('dashboard.create_new_proposal_in_only_5_minutes')}
      </SectionText>

      <CreateProposalButtonContainer>
        <Button
          href={CREATE_PROCESS_PATH}
          positive
          onClick={handleRuddlestackEvent}
        >
          {i18n.t('dashboard.create_proposal')}
        </Button>
      </CreateProposalButtonContainer>
    </Card>
  )
}
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
