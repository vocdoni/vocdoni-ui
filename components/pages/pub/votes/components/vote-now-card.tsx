import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { SectionText, TextAlign } from '@components/elements/text'
import { ImageContainer } from '@components/elements/images'
import { Button, LinkTarget } from '@components/elements/button'
import { Card } from '@components/elements/cards'
import { FlexJustifyContent } from '@components/elements/flex'
import { useIsMobile } from '@hooks/use-window-size'

interface IVoteNowCardProps {
  disabled: boolean
  explorerLink: string
  hasVoted: boolean
  onVote: () => void
  isInline: boolean
}

export const VoteNowCard = ({
  disabled,
  hasVoted,
  explorerLink,
  onVote,
  isInline
}: IVoteNowCardProps) => {
  const { i18n } = useTranslation()
  const isMobile = useIsMobile
  return <Card>
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

      <Button wide small={!isMobile} positive href={explorerLink} target={LinkTarget.Blank}>
        {i18n.t('vote.view_link')}
      </Button>
      </div>

    ) : (
      <div>
      <TextContainer align={TextAlign.Center}>
        {i18n.t('vote.you_can_vote_on_this_proposal')}
      </TextContainer>

      { !isInline && (
        <Button wide positive disabled={disabled} onClick={onVote}>
          {i18n.t('vote.vote_now')}
        </Button>
      )}
      </div>
    )}
  </Card>
}

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
  font-size: 16px;
`
