import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'
import { ImageContainer } from '@components/images'
import { SectionText, SectionTitle, TextAlign } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { Button } from '@components/button'
import { DASHBOARD_PATH } from '@const/routes'

export const VoteSubmitted = () => (
  <>
    <ImageContainer width="430px">
      <img
        src="/images/vote/voted-submitted.png"
        alt={i18n.t('vote.vote_submitted_image_alt')}
      />

      <TextContainer>
        <SectionTitle align={TextAlign.Center}>
          {i18n.t('vote.your_vote_has_been_registered')}
        </SectionTitle>
        <SectionText>
          {i18n.t('vote.thanks_for_participate_on_this_AGM')}
        </SectionText>
      </TextContainer>

      <FlexContainer justify={FlexJustifyContent.Center}>
        <Button positive href={DASHBOARD_PATH}>{i18n.t('vote.go_back_to_home_page')}</Button>
      </FlexContainer>
    </ImageContainer>
  </>
)

const TextContainer = styled.div``
