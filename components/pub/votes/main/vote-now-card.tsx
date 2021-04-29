import React from 'react'

import i18n from '@i18n'

import { CREATE_PROCESS_PATH } from '@const/routes'

import { SectionText, TextAlign } from '@components/text'
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'
import { Card } from '@components/cards'

export const VoteNowCard = () => (
  <Card>
    <ImageContainer width="80px">
      <img src="/images/vote/vote-now.png"></img>
    </ImageContainer>

    <SectionText align={TextAlign.Center}>
      {i18n.t('vote.you_cant_vote_now_on_this_proposal')}
    </SectionText>

    
      <Button wide href={CREATE_PROCESS_PATH} positive>
        {i18n.t('vote.vote_now')}
      </Button>
  </Card>
)


