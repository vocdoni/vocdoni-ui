import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { SectionText, TextAlign, TextSize } from '@components/elements/text'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { Button } from '@components/elements/button'
import { colors } from 'theme/colors'
import { Spacer, Col, Row, Text } from '@components/elements-v2'

interface IVoteSubmittedProps {
  onAccept: () => void
}

export const VoteSubmitted = ({ onAccept }: IVoteSubmittedProps) => {
  const { i18n } = useTranslation()
  return (
    <>
      <ImageContainer width="80px" justify={FlexJustifyContent.Start}>
        <img
          src="/images/app/fcb_logo.png"
          alt={i18n.t('vote.vote_submitted_image_alt')}
        />
      </ImageContainer>

      <TextContainer>
        <SectionText size={TextSize.Big} align={TextAlign.Left} color={colors.FCBBlue}>
          {i18n.t('vote.your_vote_has_been_registered')}
        </SectionText>
        <Text size='sm'>
          {i18n.t('fcb.vote_verification_text')}<a href=''>{i18n.t('fcb.block_explorer')}</a>.
          {i18n.t('fcb.confirmation_code')}<strong>4d9dac8f566a0ab448efa4c1973579c3d48409aae5d4493ef441bbc7a227dd85</strong>.
        </Text>

        <Spacer direction='vertical' size='3xl' />

        <Text size='sm'>
          {i18n.t('fcb.vote_registered')}<strong>22 de juliol a les 00:00 CEST</strong>{i18n.t('fcb.vote_finalized')}
        </Text>
      </TextContainer>

      <FlexContainer justify={FlexJustifyContent.Start}>
        <Button fcb onClick={onAccept}>{i18n.t('vote.go_back_to_home_page')}</Button>
        <HoritzontalSpacer></HoritzontalSpacer>
        <Button fcb_border onClick={onAccept}>{i18n.t('app.header.disconnect_account')}</Button>
      </FlexContainer>
    </>
  )
}

const TextContainer = styled.div`
  margin-bottom: 30px;
  margin-top: 30px;
`

const HoritzontalSpacer = styled.div`
  margin-left: 40px;
`
