import React from 'react'
import styled from 'styled-components'

import i18n from '../../i18n'
import { colors } from '../../theme/colors'

import RouterService from '@lib/router'

import { DASHBOARD_PATH, VOTING_AUTH_FORM_PATH, VOTING_AUTH_LINK_PATH, VOTING_AUTH_MNEMONIC_PATH } from '@const/routes'

import { useProcessCreation } from '@hooks/process-creation'

import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { DashedLink } from '@components/common/dashed-link'
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'
import { useScrollTop } from '@hooks/use-scroll-top'
import { Else, If, Then } from 'react-if'
import { HelpText } from '@components/common/help-text'

export const ProcessReady = () => {
  useScrollTop()
  const { processId, metadata } = useProcessCreation()

  const linkCensus = !metadata?.meta?.formFieldTitles
  const voteUrl = linkCensus
    ? RouterService.instance.get(VOTING_AUTH_LINK_PATH, { processId, key: 'PRIVATE_KEY' })
    : RouterService.instance.get(VOTING_AUTH_FORM_PATH, { processId })

  const menmonicUrl = linkCensus
    ? RouterService.instance.get(VOTING_AUTH_MNEMONIC_PATH, { processId })
    : ''

  return (
    <ProcessReadyContainer>
      <ImageContainer width="500px" justify={FlexJustifyContent.Center}>
        <img src="/images/vote/create-proposal.png" />
      </ImageContainer>

      <SectionTitle align={TextAlign.Center}>
        {i18n.t('vote.your_vote_is_set_up')}
      </SectionTitle>


      <If condition={!linkCensus}>
        <Then>
          <SectionText align={TextAlign.Center}>
            {i18n.t(
              'vote.this_is_the_link_that_you_need_to_send_your_community_members'
            )}
          </SectionText>
          <DashedLink link={voteUrl} />
        </Then>
        <Else>
          <SectionText align={TextAlign.Center}>
            {i18n.t(
              'vote.this_is_the_link_that_you_need_to_send_your_community_members_replacing_the_corresponding_private_key'
            )}
            <HelpText text={i18n.t(
              'vote.this_is_the_link_that_you_need_to_send_your_community_members_replacing_the_corresponding_private_key_helper'
            )} />
          </SectionText>
          <DashedLink link={voteUrl} />
          <SectionText align={TextAlign.Center}>
            {i18n.t(
              'vote.this_is_the_link_that_your_community_members_can_use_to_access_via_mnemonic'
            )}
            <HelpText text={i18n.t(
              'vote.this_is_the_link_that_your_community_members_can_use_to_access_via_mnemonic_helper'
            )} />
          </SectionText>
          <DashedLink link={menmonicUrl} />
        </Else>
      </If>


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
