import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign, TextSize } from '@components/elements/text'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Button } from '@components/elements/button'
import { colors } from 'theme/colors'

interface IVoteSubmittedProps {
  onAccept: () => void
}

export const VoteSubmitted = ({ onAccept }: IVoteSubmittedProps) => {
  const { i18n } = useTranslation()
  return (
    <>
      <ImageContainer width="220px" justify={FlexJustifyContent.Center}>
        <img
          src="/images/common/logo.png"
          alt={i18n.t('vote.vote_submitted_image_alt')}
        />
      </ImageContainer>

      <TextContainer>
        <SectionText size={TextSize.Big} align={TextAlign.Center}>
          {i18n.t('vote.your_vote_has_been_registered')}
        </SectionText>
        <SectionText color={colors.lightText} align={TextAlign.Center}>
          {i18n.t('vote.thanks_for_participate_on_this_AGM')}
        </SectionText>
      </TextContainer>

      <FlexContainer justify={FlexJustifyContent.Center}>
        <Button positive onClick={onAccept}>{i18n.t('vote.go_back_to_home_page')}</Button>
      </FlexContainer>

      <br />
    </>
  )
}

const TextContainer = styled.div`
  margin-bottom: 12px;
  margin-top: 30px;
`
