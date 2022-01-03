import React from 'react'
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
import { VotingState } from '..'
import { FlexContainer, FlexDirection } from '@components/elements/flex'
import { colors } from '@theme/colors'
import { theme } from '@theme/global'
import { useCalendar } from '@hooks/use-calendar'
import * as ButtonV2 from '@components/elements-v2/button'
import { LinkButton } from '@components/elements-v2/link-button'
import { TextButton, ITextButtonProps } from '@components/elements-v2/text-button'

interface IVoteActionCardProps {
  disabled: boolean
  explorerLink: string
  votingState: VoteStatus
  startDate: Date
  endDate: Date
  totalVotes: Number,

  onClick: () => void
  onLogOut?: () => void
}

export const VoteActionCard = ({
  disabled,
  votingState,
  explorerLink,
  startDate,
  endDate,
  totalVotes,
  onClick,
  onLogOut,
}: IVoteActionCardProps) => {
  const { i18n } = useTranslation()
  const { getDateDiff } = useCalendar()
  const seeResultsIcon = (
    <img
      src="/images/vote/chevron-right.svg"
      alt={i18n.t('vote.pdf_image_alt')}
    />
  )
  const getTitleFromState = (status: VoteStatus) => {
    const endingIn = getDateDiff(null, endDate, 'diff')
    const startingIn = getDateDiff(null, startDate, 'diff')
    let endingString, startingString
    switch (endingIn.format) {
      case 'days':
        endingString = i18n.t("vote.value_days", { value: endingIn.value })
        startingString = i18n.t("vote.value_days", { value: startingIn.value })
        break
      default:
        endingString = getDateDiff(null, endDate, 'countdown').value + 's'
        startingString = getDateDiff(null, startDate, 'countdown').value + 's'
    }
    switch (status) {
      case VoteStatus.Ended:
        return i18n.t('vote.your_vote_has_been_registered')

      case VoteStatus.Ended:
        return i18n.t('vote.the_voting_process_has_endded')
      case VoteStatus.Active:
        return (
          <>
            <Text>
              {i18n.t('vote.vote_will_close')}
            </Text>
            <Text bold large>
              {endingString}
            </Text>
          </>
        )
      case VoteStatus.Upcoming:
        return (
          <>
            <Text>
              {i18n.t('vote.vote_will_start')}
            </Text>
            <Text bold large>
              {startingString}
            </Text>
          </>
        )
    }
  }
  const getButtonFromState = (status: VoteStatus) => {
    switch (status) {
      case VoteStatus.Ended:
        return (
          <>
            <Button wide target={LinkTarget.Blank} positive href={explorerLink}>
              {i18n.t('vote.view_in_explorer')}
            </Button>

            {/* <ButtonContainer>
              <Button wide onClick={onLogOut}>
                {i18n.t('app.header.disconnect_account')}
              </Button>
            </ButtonContainer> */}
          </>
        )

      case VoteStatus.Upcoming:
        return (
          <>
            <Button wide disabled={disabled} positive>
              {i18n.t('vote.vote_now')}
            </Button>
            {/* <ButtonContainer>
              <Button wide onClick={onLogOut}>
                {i18n.t('vote.log_out')}
              </Button>
            </ButtonContainer> */}
          </>
        )
      case VoteStatus.Active:
        return (
          <>
            <Button wide disabled={disabled} positive onClick={onClick}>
              {i18n.t('vote.vote_now')}
            </Button>
          </>
        )
      default:
        return <></>
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
    <BannerDiv positive={votingState == VoteStatus.Ended}>
      <BannerMainDiv radius='top'>
        <BannerIcon>
          <ImageContainer width="80px">
            <img
              src={getVotingImage(votingState)}
              alt={i18n.t('vote.voted_alt')}
            />

            {getVotingIcon(votingState) && (
              <CheckImageContainer>
                <img src={getVotingIcon(votingState)} />
              </CheckImageContainer>
            )}
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
      <BannerMainDiv radius='bottom' background={colors.lightBg} padding='large'>
        <Text bold>
          {i18n.t('vote.total_votes_submited')}
        </Text>
        {/* TODO
          The percentage cannot be coputed because the length
          of the census is unknown
        */}
        <Text large>
          {totalVotes} (0%)
        </Text>
        <VerticalSpacer />
        <TextButton iconRight={seeResultsIcon}>
          {i18n.t('vote.see_results')}
        </TextButton>
      </BannerMainDiv>
    </BannerDiv>
  )
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

const BannerMainDiv = styled.div<{ background?: string, radius?: 'top' | 'bottom' | 'all', padding?: 'large' }>`
  padding: 32px;
  display: flex;
  background-color: ${({ background }) => background ? background : ''};
  flex-direction: column;
  justify-content: space-between;
  align-items: center;
  border-radius: ${({ radius }) => radius === 'all' ? '16px' : radius === 'top' ? '16px 16px 0px 0px' : radius === 'bottom' ? '0px 0px 16px 16px' : ''};
`

const BannerTitle = styled.h2<{ positive?: boolean }>`
  color: ${({ theme, positive }) =>
    positive ? theme.textAccent2B : theme.text};
  font-weight: normal;
  margin: 0 0 10px;
  text-align: center;
`
const Text = styled.p<{ large?: boolean, bold?: boolean }>`
  font-family: Manrope;
  font-weight: ${({ bold }) => bold ? '600' : '400;'};
  font-size: ${({ large }) => large ? '24px' : '20px;'};
  margin: 0;
  line-height: 28px;
  text-align: center;
  color: ${colors.blueText};
`
