import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { Button, LinkTarget } from '@components/elements/button'
import { VotingState } from '..'
import {
  TextAlign,
  Typography,
  TypographyVariant,
} from '@components/elements/typography'

interface IVoteActionCardProps {
  disabled: boolean
  explorerLink: string
  votingState: VotingState
  onClick: () => void
  onLogOut?: () => void
}

export const VoteActionCard = ({
  disabled,
  votingState,
  explorerLink,
  onClick,
  onLogOut,
}: IVoteActionCardProps) => {
  const { i18n } = useTranslation()

  const getTitleFromState = (status: VotingState) => {
    switch (status) {
      case VotingState.Ended:
        return i18n.t('vote.your_vote_has_been_registered')

      case VotingState.Expired:
        return i18n.t('vote.the_voting_process_has_endded')

      case VotingState.NotStarted:
        return i18n.t('vote.you_can_vote_on_this_proposal')

      case VotingState.Guest:
        return i18n.t('vote.you_need_authenticate_to_vote')
    }
  }

  const getButtonFromState = (status: VotingState) => {
    switch (status) {
      case VotingState.Ended:
        return (
          <>
            <div></div>
          </>
        )

      case VotingState.NotStarted:
        return (
          <>
            <Button wide disabled={disabled} positive onClick={onClick}>
              {i18n.t('vote.vote_now')}
            </Button>
          </>
        )

      case VotingState.Guest:
        return (
          <Button wide positive onClick={onClick}>
            {i18n.t('vote.vote_now')}
          </Button>
        )
      default:
        return <></>
    }
  }

  const getVotingImage = (status: VotingState) => {
    switch (status) {
      case VotingState.Ended:
        return '/images/vote/vote-now.png'

      case VotingState.Guest:
        return '/images/vote/vote-now.png'

      default:
        return '/images/vote/vocdoni-vote.png'
    }
  }

  const getVotingIcon = (status: VotingState) => {
    switch (status) {
      case VotingState.Ended:
        return '/images/vote/vote-check.png'

      case VotingState.Guest:
        return '/icons/common/warning.svg'

      default:
        return ''
    }
  }

  return (
    <BannerDiv positive={votingState == VotingState.Ended}>
      <BannerMainDiv>
        <BannerIcon>
          <ImageContainer width="80px">
            <ImageColor
              src={getVotingImage(votingState)}
              alt={i18n.t('vote.voted_alt')}
            />
          </ImageContainer>
        </BannerIcon>

        <BannerText>
          <Typography
            variant={TypographyVariant.Body2}
            align={TextAlign.Center}
          >
            {getTitleFromState(votingState)}
          </Typography>
          <div>{getButtonFromState(votingState)}</div>
        </BannerText>
      </BannerMainDiv>
    </BannerDiv>
  )
}

const ImageColor = styled.img`
  filter: hue-rotate(200deg) grayscale(.5);
  opacity: 0.75;
`

const BannerDiv = styled.div<{ positive?: boolean }>`
  padding: 16px;
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;
  background-color: #D3D3D3;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 12px;
  }

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 14px;
  }
`

const CheckImageContainer = styled.div`
  position: absolute;
  max-width: 32px;
  margin-top: 46px;
  margin-left: 23px;

  & > img {
    width: 100%;
  }
`

const ButtonContainer = styled.div`
  margin-top: 16px;
`

const BannerIcon = styled.div`
  flex: 1;
  margin-bottom: 10px;
`
const BannerText = styled.div`
  flex: 10;
  margin: 0 10px;
`

const BannerMainDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
`

const BannerTitle = styled.h2<{ positive?: boolean }>`
  color: ${({ theme, positive }) =>
    positive ? theme.textAccent2B : theme.text};
  font-weight: normal;
  margin: 0 0 10px;
  text-align: center;
`
