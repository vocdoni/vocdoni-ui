import React, { useEffect, useState } from 'react'
import styled from 'styled-components'

import { useTranslation } from 'react-i18next'

import { ImageContainer } from '@components/elements/images'
import { Button, LinkTarget } from '@components/elements/button'
import {
  TextAlign,
  Typography,
  TypographyVariant,
} from '@components/elements/typography'
import { VoteStatus } from '@lib/util'
import { colors } from '@theme/colors'
import { TextButton } from '@components/elements-v2/text-button'
import { useVoting } from '@hooks/use-voting'
import { useUrlHash } from 'use-url-hash'
import { Else, If, Then } from 'react-if'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { ChevronRightIcon } from '@components/elements-v2/icons'
import { UserVoteStatus } from '..'
import { dateDiffStr, DateDiffType } from '@lib/date-moment'
import { BigNumber } from 'ethers'
import { Spacer } from '@components/elements-v2'

interface IVoteActionCardProps {
  userVoteStatus: UserVoteStatus
  onClick: () => void
  onSeeResults?: () => void
}

export const VoteActionCard = ({
  userVoteStatus,
  onClick,
  onSeeResults,
}: IVoteActionCardProps) => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1)
  const { startDate, endDate, votesWeight, status, censusSize, liveResults } =
    useProcessWrapper(processId)
  const { nullifier } = useVoting(processId)
  const disabled =
    status !== VoteStatus.Active || userVoteStatus === UserVoteStatus.Emitted
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier

  const getTitleFromState = (status: VoteStatus) => {
    const endingString = dateDiffStr(DateDiffType.Countdown, endDate)
    const startingString = dateDiffStr(DateDiffType.Countdown, startDate)
    if (userVoteStatus === UserVoteStatus.Emitted) {
      return (
        <Text bold large>
          {i18n.t('vote.your_vote_has_been_registered')}
        </Text>
      )
    } else if (
      userVoteStatus === UserVoteStatus.Expired ||
      status === VoteStatus.Ended
    ) {
      return (
        <Text bold large>
          {i18n.t('vote.the_voting_process_has_endded')}
        </Text>
      )
    } else if (status === VoteStatus.Active) {
      return (
        <>
          <Text>{i18n.t('vote.vote_will_close')}</Text>
          <Text bold large>
            {endingString}
          </Text>
        </>
      )
    } else if (status === VoteStatus.Upcoming) {
      return (
        <>
          <Text>{i18n.t('vote.vote_will_start')}</Text>
          <Text bold large>
            {startingString}
          </Text>
        </>
      )
    }
  }
  const getButtonFromState = (status: VoteStatus) => {
    if (userVoteStatus === UserVoteStatus.Emitted) {
      return (
        <>
          <Button wide target={LinkTarget.Blank} positive href={explorerLink}>
            {i18n.t('vote.view_in_explorer')}
          </Button>
        </>
      )
    } else if (status === VoteStatus.Ended) {
      return null
    } else {
      return (
        <Button wide disabled={disabled} positive onClick={onClick}>
          {i18n.t('vote.vote_now')}
        </Button>
      )
    }
  }

  const getVotingImage = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.Ended:
        return '/images/vote/vote-now.png'

      case VoteStatus.Upcoming:
        return '/images/vote/vote-now.png'

      default:
        return '/images/vote/vote-now.png'
    }
  }

  const getVotingIcon = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.Ended:
        return '/images/vote/vote-check.png'

      // case VoteStatus.Upcoming:
      //   return '/icons/common/warning.svg'

      default:
        return ''
    }
  }

  return (
    <BannerDiv positive={status == VoteStatus.Ended}>
      <BannerMainDiv radius="top">
        <BannerIcon>
          <ImageContainer width="80px">
            <img src={getVotingImage(status)} alt={i18n.t('vote.voted_alt')} />

            {getVotingIcon(status) && (
              <CheckImageContainer>
                <img src={getVotingIcon(status)} />
              </CheckImageContainer>
            )}
          </ImageContainer>
        </BannerIcon>

        <BannerText>
          {getTitleFromState(status)}
          <Spacer direction="vertical" size="3xl"></Spacer>
          <div>{getButtonFromState(status)}</div>
        </BannerText>
      </BannerMainDiv>

      <BannerMainDiv
        radius="bottom"
        background={colors.lightBg}
        padding="large"
      >
        <Text bold>{i18n.t('vote.total_votes_submited')}</Text>
        <Text large>
          <If condition={liveResults && votesWeight && censusSize}>
            <Then>
              {votesWeight?.toString()} (
              {getPercent(votesWeight, BigNumber.from(censusSize || 1))}%)
            </Then>
            <Else>0 (0%)</Else>
          </If>
        </Text>

        <VerticalSpacer />
        <TextButton
          iconRight={<ChevronRightIcon />}
          onClick={() => onSeeResults()}
        >
          {i18n.t('vote.see_results')}
        </TextButton>
      </BannerMainDiv>
    </BannerDiv>
  )
}
const getPercent = (votes: BigNumber, totalVotes: BigNumber): number => {
  const ratio = votes?.div(totalVotes)
  return ratio?.mul(100).toNumber()
}

const BannerDiv = styled.div<{ positive?: boolean }>`
  background: linear-gradient(
    106.26deg,
    ${({ theme, positive }) => (positive ? theme.accentLight1B : theme.white)}
      5.73%,
    ${({ theme, positive }) => (positive ? theme.accentLight1 : theme.white)}
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

const VerticalSpacer = styled.div`
  margin: 10px 0px;
`
const TextContainer = styled.div`
  margin-top: 24px;
  margin-bottom: 24px;
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

const BannerMainDiv = styled.div<{
  background?: string
  radius?: 'top' | 'bottom' | 'all'
  padding?: 'large'
}>`
  padding: 32px;
  display: flex;
  background-color: ${({ background }) => (background ? background : '')};
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: ${({ radius }) =>
    radius === 'all'
      ? '16px'
      : radius === 'top'
      ? '16px 16px 0px 0px'
      : radius === 'bottom'
      ? '0px 0px 16px 16px'
      : ''};
`

const BannerTitle = styled.h2<{ positive?: boolean }>`
  color: ${({ theme, positive }) =>
    positive ? theme.textAccent2B : theme.text};
  font-weight: normal;
  margin: 0 0 10px;
  text-align: center;
`
const Text = styled.p<{ large?: boolean; bold?: boolean }>`
  font-family: Manrope;
  font-weight: ${({ bold }) => (bold ? '600' : '400;')};
  font-size: ${({ large }) => (large ? '24px' : '20px;')};
  margin: 0;
  line-height: 28px;
  text-align: center;
  color: ${colors.blueText};
`
