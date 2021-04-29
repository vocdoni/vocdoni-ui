import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { CREATE_PROCESS_PATH } from '@const/routes'

import { SectionText, TextAlign } from '@components/text'
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'
import { Card } from '@components/cards'
import { FlexJustifyContent } from '@components/flex'

export const VoteNowCard = () => (
  <Card>
    <ImageContainer width="80px" justify={FlexJustifyContent.Center}>
      <img src="/images/vote/vote-now.png"></img>
    </ImageContainer>

    <TextContainer align={TextAlign.Center}>
      {i18n.t('vote.you_cant_vote_now_on_this_proposal')}
    </TextContainer>

    <Button wide href={CREATE_PROCESS_PATH} positive>
      {i18n.t('vote.vote_now')}
    </Button>
  </Card>
)

const TextContainer = styled(SectionText)`
  margin: 12px 0;
  font-size: 20px;
`
