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
  nullifier: string | BigInt
  onAccept: () => void
  onClose?: () => void
}

export const VoteSubmitted = ({ nullifier, onAccept, onClose }: IVoteSubmittedProps) => {
  const { i18n } = useTranslation()
  return (
    <>
      <CloseButton onClick={onClose}>
        <ColorSpan>x</ColorSpan>
      </CloseButton>

      <ImageContainer width="80px" justify={FlexJustifyContent.Start}>
        <img
          src="/images/app/fcb_logo.png"
          alt={i18n.t('vote.vote_submitted_image_alt')}
        />
      </ImageContainer>

      <TextContainer>
        <ModalHeader>
          {i18n.t('vote.your_vote_has_been_registered')}
        </ModalHeader>
        <Text size='sm'>
          {i18n.t('fcb.confirmation_code')}<strong>{nullifier}</strong>.
        </Text>

        <Spacer direction='vertical' size='3xl' />

        <Text size='sm'>
          {i18n.t('fcb.vote_registered')}
        </Text>
      </TextContainer>

      <FlexContainer justify={FlexJustifyContent.Start}>
        <Button fcb onClick={onAccept}>{i18n.t('vote.go_back_to_home_page')}</Button>
      </FlexContainer>

      <Spacer direction='vertical' size='3xl' />
    </>
  )
}


const ModalHeader = styled(SectionText)`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: ${({ theme }) => theme.accent1};
  background: -webkit-linear-gradient(03.11deg, #CF122D 9.45%, #154284 90.55%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
`

const TextContainer = styled.div`
  margin-bottom: 30px;
  margin-top: 30px;
`

const HoritzontalSpacer = styled.div`
  margin-left: 40px;
`

const CloseButton = styled.div`
  position: absolute;
  top: 10px;
  right: 10px;
  width: 38px;
  height: 38px;
  align-items: center;
  font-size: 18px;
  line-height: 18px;
  cursor: pointer;

  display: flex;
  align-items: center;
  text-align: center;
  justify-content: center;

  background:
    linear-gradient(#fff 0 0) padding-box, /*this is the white background*/
    linear-gradient(to right, #A50044, #174183) border-box;

  border: 2px solid transparent;
  border-radius: 8px;
  display: inline-block;
`

const ColorSpan = styled.span`
  background: -webkit-linear-gradient(103.11deg, #A50044 0.33%, #174183 99.87%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-fill-color: transparent;
  font-weight: 400;
  margin-top:9px;
  padding-left:1px;
  display:block;
`
