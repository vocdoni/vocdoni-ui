import React from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { CREATE_PROCESS_PATH } from '@const/routes'

import { SectionText, TextAlign } from '@components/text'
import { ImageContainer } from '@components/images'
import { Button } from '@components/button'
import { Card } from '@components/cards'
import { FlexJustifyContent } from '@components/flex'

interface IVoteNowCardProps {
  disabled: boolean
  explorerLink: string
  hasVoted: boolean
  onVote: () => void
}

export const VoteNowCard = ({
  disabled,
  hasVoted,
  explorerLink,
  onVote,
}: IVoteNowCardProps) => (
  <Card>
    <ImageContainer width="80px" justify={FlexJustifyContent.Center}>
      <img src="/images/vote/vote-now.png" />
      <CheckImageContainer>
        <img src="/images/vote/vote-check.png" />
      </CheckImageContainer>
    </ImageContainer>

    {hasVoted ? (
      <div>
      <TextContainer align={TextAlign.Center}>
        {i18n.t('vote.verify_your_vote_in_the_explorer')}
      </TextContainer>

      <Button wide positive href={explorerLink}>
        {i18n.t('vote.view_link')}
      </Button>
      </div>

    ) : (
      <div>
      <TextContainer align={TextAlign.Center}>
        {i18n.t('vote.you_cant_vote_now_on_this_proposal')}
      </TextContainer>

      <Button wide positive disabled={disabled} onClick={onVote}>
        {i18n.t('vote.vote_now')}
      </Button>
      </div>
    )}
  </Card>
)

const CheckImageContainer = styled.div`
  position: absolute;
  max-width: 32px;
  margin-top: 46px;

  & > img {
    width: 100%;
  }
`
const TextContainer = styled(SectionText)`
  margin: 12px 0;
  font-size: 20px;
`
