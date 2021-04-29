import React from 'react'
import styled from 'styled-components'
import copy from 'copy-to-clipboard';

import i18n from '../../i18n'
import { colors } from '../../theme/colors'
import { DASHBOARD_PATH } from '../../const/routes';

import { Button } from '../button'
import { FlexContainer, FlexJustifyContent } from '../flex'
import { ImageContainer } from '../images'
import { SectionText, SectionTitle, TextAlign } from '../text'
import { useProcessCreation } from '../../hooks/process-creation';

export const ProcessReady = () => {
  const { processId } = useProcessCreation()
  const voteUrl = typeof location != "undefined" ? 'https://' + location.host + '/vote/auth/#/' + processId : ""

  const handleCopy = () => {
    copy(voteUrl)
  }

  return (
    <ProcessReadyContainer>
      <ImageContainer width="500px">
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

      <LinkContainer justify={FlexJustifyContent.SpaceBetween}>
        <LinkText>{voteUrl}</LinkText>

        <Button color={colors.textAccent1} border onClick={handleCopy}>
          {i18n.t('vote.copy')}
        </Button>
      </LinkContainer>

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

const LinkContainer = styled(FlexContainer)`
  border: dashed 2px ${({ theme }) => theme.lightBorder};
  padding: 8px 16px;
  border-radius: 6px;
`

const LinkText = styled(SectionText)`
  color: ${({ theme }) => theme.textAccent1};
  margin: 12px 0;
`

const BackButtonContainer = styled(FlexContainer)`
  margin-top: 30px;
`
