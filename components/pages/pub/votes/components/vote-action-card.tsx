import React from 'react'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { Button, LinkTarget } from '@components/elements/button'
import { VotingState } from '..'

interface IVoteActionCardProps {
  disabled: boolean
  explorerLink: string
  votingState: VotingState
  onClick: () => void
}

export const VoteActionCard = ({
  disabled,
  votingState,
  explorerLink,
  onClick,
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

      case VotingState.Started:
    }
  }

  const getButtonFromState = (status: VotingState) => {
    switch (status) {
      case VotingState.Ended:
        return (
          <Button
            wide
            target={LinkTarget.Blank}
            positive
            href={explorerLink}
          >
            {i18n.t('vote.view_in_explorer')}
          </Button>
        )

      case VotingState.NotStarted:
        return (
          <Button wide disabled={disabled} positive onClick={onClick}>
            {i18n.t('vote.vote_now')}
          </Button>
        )

      default:
        return (
          <></>
        )
    }
  }

  if (votingState == VotingState.Guest)
    return (<></>)

  return (
    <BannerDiv positive={votingState == VotingState.Ended}>
      <BannerMainDiv>
        <BannerIcon>
          <ImageContainer width="80px">
            <img
              src={votingState == VotingState.Ended ? "/images/vote/vote-now.png" : "/images/vote/vocdoni-vote.png"}
              alt={i18n.t('vote.voted_alt')}
            />

            {votingState == VotingState.Ended && (
              <CheckImageContainer>
                <img src="/images/vote/vote-check.png" />
              </CheckImageContainer>
            )}
          </ImageContainer>
        </BannerIcon>

        <BanerText>
          <BannerTitle>
            {getTitleFromState(votingState)}
          </BannerTitle>
          <div>
            {getButtonFromState(votingState)}
          </div>
        </BanerText>
      </BannerMainDiv>
    </BannerDiv>
  )
}

const BannerDiv = styled.div<{ positive?: boolean }>`
  padding: 16px;
  background: linear-gradient(
    106.26deg,
    ${({ theme, positive }) =>
    positive ? theme.accentLight1B : theme.white}
      5.73%,
    ${({ theme, positive }) =>
    positive ? theme.accentLight1 : theme.white}
      93.83%
  );
  box-shadow: 0px 3px 3px rgba(180, 193, 228, 0.35);
  border-radius: 16px;

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

const BannerIcon = styled.div`
  flex: 1;
  margin-bottom: 10px;
`
const BanerText = styled.div`
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
  color: ${({ theme, positive }) => (positive ? theme.textAccent2B : theme.text)};
  font-weight: normal;
  margin: 0 0 10px;
  text-align: center;
`
