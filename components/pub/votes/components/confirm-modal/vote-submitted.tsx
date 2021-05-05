import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'
import { ImageContainer } from '@components/images'
import { SectionText, SectionTitle, TextAlign, TextSize } from '@components/text'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { Button } from '@components/button'
import { DASHBOARD_PATH } from '@const/routes'
import { colors } from 'theme/colors'

interface IVoteSubmittedProps {
  onAccept: () => void
}

export const VoteSubmitted = ({onAccept}: IVoteSubmittedProps) => (
  <>
    <ImageContainer width="320px" justify={FlexJustifyContent.Center}>
      <img
        src="/images/vote/voted-submitted.png"
        alt={i18n.t('vote.vote_submitted_image_alt')}
      />
    </ImageContainer>

      <TextContainer>
        <SectionText size={TextSize.Big} align={TextAlign.Center}>
          {i18n.t('vote.your_vote_has_been_registered')}
        </SectionText>
        <SectionText color={colors.lightText}>
          {i18n.t('vote.thanks_for_participate_on_this_AGM')}
        </SectionText>
      </TextContainer>

      <FlexContainer justify={FlexJustifyContent.Center}>
        <Button positive onClick={onAccept}>{i18n.t('vote.go_back_to_home_page')}</Button>
      </FlexContainer>
  </>
)

const TextContainer = styled.div`
  margin-bottom: 12px;
`
