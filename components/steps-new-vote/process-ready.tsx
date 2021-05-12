import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'
import { colors } from '../../theme/colors'

import RouterService from '@lib/router'

import { DASHBOARD_PATH, VOTING_AUTH_FORM_PATH } from '@const/routes';

import { useProcessCreation } from '@hooks/process-creation';

import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { DashedLink } from '@components/common/dashed-link';
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'
import { useScrollTop } from "@hooks/use-scroll-top"

export const ProcessReady = () => {
  useScrollTop()
  const { processId } = useProcessCreation()
  const voteUrl = RouterService.instance.get(VOTING_AUTH_FORM_PATH, {processId})

  return (
    <ProcessReadyContainer>
      <ImageContainer width="500px" justify={FlexJustifyContent.Center}>
        <img src="/images/vote/create-proposal.png" />
      </ImageContainer>

      <SectionTitle align={TextAlign.Center}>
        {i18n.t('vote.your_vote_is_set_up')}
      </SectionTitle>
      
      <SectionText align={TextAlign.Center}>
        {i18n.t(
          'vote.this_is_the_link_that_you_need_to_send_your_community_members'
        )}
      </SectionText>

      <DashedLink link={voteUrl}/>

      <BackButtonContainer justify={FlexJustifyContent.Center}>
        <Button color={colors.textAccent1} href={DASHBOARD_PATH} border>
          {i18n.t('vote.back_to_dashboard')}
        </Button>
      </BackButtonContainer>
    </ProcessReadyContainer>
  )
}

const ProcessReadyContainer = styled.div`
  min-height: 600px;
  max-width: 620px;
  margin: auto;
`

const BackButtonContainer = styled(FlexContainer)`
  margin-top: 30px;
`
