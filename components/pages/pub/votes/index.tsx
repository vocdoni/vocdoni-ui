import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import { useBlockStatus, useEntity, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { If, Then, Else, When } from 'react-if'

import { Question, VotingType } from '@lib/types'

import { useTheme } from '@hooks/use-theme'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Column, Grid } from '@components/elements/grid'
import { Card, CardDiv, PageCard } from '@components/elements/cards'
// import { Button } from '@components/elements/button'
import { Button } from '@components/elements-v2/button'
import { FlexContainer } from '@components/elements/flex'
import { VoteQuestionCard } from '@components/blocks/vote-question-card'
import { MetadataFields } from '@components/pages/votes/new/metadata'

import { CardImageHeader } from '@components/blocks/card/image-header'
import { VoteDescription } from '@components/blocks/vote-description'

import { ConfirmModal } from './components/confirm-modal'
import { VoteActionCard } from './components/vote-action-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { useUrlHash } from 'use-url-hash'
import { VotingApi, EntityMetadata } from 'dvote-js'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { Body1, TextAlign, Typography, TypographyVariant } from '@components/elements/typography'
import { QuestionsList } from './components/questions-list'
import { censusProofState } from '@recoil/atoms/census-proof'
import { VoteRegisteredCard } from './components/vote-registered-card'
import RouterService from '@lib/router'
import { VOTING_AUTH_FORM_PATH } from '@const/routes'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { ExpandableCard } from '@components/blocks/expandable-card'
import { NoResultsCard } from '@components/blocks/NoResultsCard'
import { Banner } from '@components/elements-v2/banner'
import { Col, Row, IColProps } from '@components/elements-v2/grid'
import { Spacer } from '@components/elements-v2/spacer'
import { QuestionResults } from '@components/blocks/question-results'
import { TotalVotesCard } from '@components/blocks/total-votes-card'
import { useCalendar } from '@hooks/use-calendar'
import { Text } from '@components/elements-v2/text'
import { LinkButton } from '@components/elements-v2/link-button'
import { TextButton } from '@components/elements-v2/text-button'

import Modal from 'react-rainbow-components/components/Modal'
import { DisconnectModal } from '@components/elements-v2/disconnect-modal'
import { ResultsCard } from './components/results-card'
import { useProcessInfo } from '@hooks/use-process-info'
export enum UserVoteStatus {
  /**
   * User is voting right now
   */
  InProgress = 'inProgress',
  /**
   * User vote has expired due to external
   * things like the vote is clossed
   */
  Expired = 'expired',
  /**
   * User is not authenticated
   */
  Guest = 'guest',
  /**
   * User hase emitted its vote
   */
  Emitted = 'emitted',
  /**
   * User is authenticated but hasn't
   * emitted a vote
   */
  NotEmitted = 'notEmitted',
}

interface IVideoStyle {
  width: number
  height: number
  top: number
}

export const VotingPageView = () => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1) // Skip "/"
  const router = useRouter()
  const [disconnectModalOpened, setDisconnectModalOpened] = useState(false)
  const { updateAppTheme } = useTheme()
  const censusProof = useRecoilValue(censusProofState)
  const { methods: votingMethods, choices, hasVoted, results, explorerLink } = useVoting(
  const { getDateDiff } = useCalendar()
    processId
  )
  const { process: processInfo } = useProcess(processId)
  const { startDate, endDate, status, liveResults, votingType } = useProcessInfo(processId)
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const [isExpandableCardOpen, setIsExpandableCardOpen] = useState<boolean>(false)
  /**
   * used to manage if the status of the user vote
   * see `UserVoteStatus` for a description of each
   * status
   */
  const [userVoteStatus, setUserVoteStatus] = useState<UserVoteStatus>(UserVoteStatus.NotEmitted)
  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(processInfo?.state, blockHeight)
  const entityMetadata = metadata as EntityMetadata
  const resultsCardRef = useRef(null)
  // used for getting the ending in and starting in string
  const [now, setNow] = useState(new Date)
  useEffect(() => {
    setInterval(() => {
      setNow(new Date)
    }, 1000)
  }, [])
  const endingString = getDateDiffString(now, endDate)
  const startingString = getDateDiffString(now, startDate)
  /**
   * effect to set the user vote status
   */
  useEffect(() => {
    if (hasVoted) {
      return setUserVoteStatus(UserVoteStatus.Emitted)
    }

    if (
      voteStatus === VoteStatus.Ended ||
      voteStatus === VoteStatus.Canceled ||
      voteStatus === VoteStatus.Upcoming
    ) {
      return setUserVoteStatus(UserVoteStatus.Expired)
    }

    if (!wallet) {
      return setUserVoteStatus(UserVoteStatus.Guest)
    }

    setUserVoteStatus(UserVoteStatus.NotEmitted)
  }, [wallet, hasVoted])



  const handleVoteNow = () => {
    if (userVoteStatus === UserVoteStatus.NotEmitted) {
      setUserVoteStatus(UserVoteStatus.InProgress)
    } else if (userVoteStatus === UserVoteStatus.Guest) {
      handleGotoAuth()
    }
  }
  const handleSeeResultsClick = () => {
    setIsExpandableCardOpen(true)
    setTimeout(() => {
      resultsCardRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
    }, 200)
  }
  const handleExpandableCardButtonClick = () => {
    setIsExpandableCardOpen(!isExpandableCardOpen)
  }

  const handleFinishVote = () => {
    setConfirmModalOpened(true)
  }

  const handleBackToDescription = () => {
    setUserVoteStatus(UserVoteStatus.NotEmitted)
  }

  const handleBackToVoting = () => {
    setUserVoteStatus(UserVoteStatus.InProgress)
    setConfirmModalOpened(false)
  }

  const handleOnVoted = () => {
    setUserVoteStatus(UserVoteStatus.Emitted)
    setConfirmModalOpened(false)
  }

  const handleGotoAuth = () => {
    setWallet(null)
    votingMethods.cleanup()

    setTimeout(() => {
      router.push(
        RouterService.instance.get(VOTING_AUTH_FORM_PATH, { processId })
      )
    }, 50)
  }

  const handleLogOut = () => {
    setWallet(null)
    votingMethods.cleanup()

    setTimeout(() => {
      // Force window unload after the wallet is wiped
      setDisconnectModalOpened(false)
      window.location.href = RouterService.instance.get(VOTING_AUTH_FORM_PATH, { processId })
    }, 50)
  }
  const processVotingType: VotingType = processInfo?.state?.censusOrigin as any

  const showAuthBanner = (
    status === VoteStatus.Upcoming ||
    status === VoteStatus.Active ||
    status === VoteStatus.Ended
  )
  const showDisconnectBanner = wallet && showAuthBanner
  const showNotAuthenticatedBanner = !wallet && showAuthBanner

  const showMoreIcon = (
    makeShowMoreIcon(i18n.t('vote.question_image_alt'))
  )
  const voteResultsIcon = (
    makeVoteResultsIcon(i18n.t('vote.question_image_alt'))
  )
  const authenticateIcon = (
    makeAuthenticateIcon(i18n.t('vote.question_image_alt'))
  )
  const authenticateBannerImage = (
    makeAuthenticateBannerImage(i18n.t('vote.question_image_alt'))
  )
  const disconnectIcon = (
    makeDisconnectIcon(i18n.t('vote.question_image_alt'))
  )
  const seeResultsIcon = (
    makeSeeResultsIcon(i18n.t('vote.pdf_image_alt'))
  )
  return (
    <>
      <VotingCard>
        <CardImageHeader
          title={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          subtitle={metadata?.name.default}
          entityImage={metadata?.media.avatar}
        />
        <If condition={userVoteStatus !== UserVoteStatus.InProgress}>
          <Then>
            <BodyContainer >
              <Row gutter='xxl'>
                {/* NOT AUTHENTICATED BANNER */}
                {showNotAuthenticatedBanner &&
                  <Col xs={12} disableFlex>
                    <Banner
                      variant='primary'
                      image={authenticateBannerImage}
                      subtitle={i18n.t('vote.auth.with_credentials')}
                      titleSize='regular'
                      titleWeight='bold'
                      subtitleSize='large'
                      buttonProps={
                        {
                          variant: 'primary',
                          children: i18n.t('vote.auth.auth_button'),
                          iconRight: authenticateIcon,
                          onClick: () => handleGotoAuth()
                        }
                      }
                    >
                      {i18n.t('vote.auth.not_authenticated')}
                    </Banner>
                  </Col>
                }
                {/* DISCONNECT BANNER */}
                {showDisconnectBanner &&
                  <Col xs={12} disableFlex>
                    <Banner
                      variant='primary'
                      titleSize='regular'
                      titleWeight='regular'
                      buttonProps={
                        {
                          variant: 'white',
                          children: i18n.t('vote.auth.disconnect_button'),
                          iconRight: disconnectIcon,
                          onClick: () => setDisconnectModalOpened(true)
                        }
                      }
                    >
                      {i18n.t('vote.you_are_autenticated')}
                      <Spacer size="xxs" direction="horizontal" />
                      <b> TODO :here goes the voter info</b>
                    </Banner>
                  </Col>
                }
                {/* DESCIRPTION */}
                <Col xs={12} md={9}>
                  <VoteDescription />
                </Col>
                {/* VOTE CARD */}
                <StickyCol xs={12} md={3} hiddenSmAndDown disableFlex>
                  <VoteActionCard
                    userVoteStatus={userVoteStatus}
                    onClick={handleVoteNow}
                    onSeeResults={handleSeeResultsClick}
                  />
                </StickyCol>
              </Row>
            </BodyContainer>
            <Spacer direction='vertical' size='xxxl' />
            {/* RESULTS CARD */}
            <Row gutter='xxl'>
              <Col xs={12}>
                <ExpandableCard
                  ref={resultsCardRef}
                  isOpen={isExpandableCardOpen}
                  onButtonClick={handleExpandableCardButtonClick}
                  title={i18n.t("vote.voting_results_title")}
                  icon={voteResultsIcon}
                  buttonProps={{
                    variant: 'light',
                    iconRight: showMoreIcon,
                    width: '124px',
                    children: i18n.t("vote.voting_results_show")
                  }}
                  buttonPropsOpen={{
                    variant: 'outlined',
                    iconRight: showMoreIcon,
                    width: '124px',
                    children: i18n.t("vote.voting_results_hide")
                  }}
                >
                  <ResultsCard />
                </ExpandableCard>
              </Col>
            </Row>
          </Then>
          <Else>
            <QuestionsList
              results={choices}
              questions={processInfo?.metadata?.questions}
              voteWeight={votingType === VotingType.Weighted ? censusProof?.weight : null}
              onSelect={votingMethods.onSelect}
              onFinishVote={handleFinishVote}
              onBackDescription={handleBackToDescription}
            />
          </Else>
        </If>

        {/* FIXED CARDS ON MOBILE VERSION */}

        {voteStatus === VoteStatus.Upcoming &&
          <>
            <MobileSpacer />
            <FixedContainerRow align='center' justify='center'>
              <Col>
                <Text size='lg' color='white'>
                  {i18n.t('vote.vote_will_start')}&nbsp;<b>{startingString}</b>
                </Text>
              </Col>
            </FixedContainerRow>
          </>
        }

        {voteStatus === VoteStatus.Active &&
          <>
            <MobileSpacer />
            <VoteNowFixedContainer justify='center' align='center' gutter='md'>
              <Col xs={12} justify='center'>
                <Text size='lg' color='white'>
                  {i18n.t('vote.vote_will_close')}&nbsp;<b>{endingString}</b>
                </Text>
              </Col>
              <Col xs={12} disableFlex>
                <Button variant='primary' fontSize='large'>
                  {i18n.t("vote.vote_now")}
                </Button>
              </Col>
              <Col xs={12} justify='center'>
                <Spacer direction='vertical' size='xxs' />
                <TextButton iconRight={seeResultsIcon} onClick={handleSeeResultsClick}>
                  {i18n.t("vote.see_results")}
                </TextButton>
                <Spacer direction='vertical' size='xxs' />
              </Col>
            </VoteNowFixedContainer>
          </>
        }


        {/* HAS VOTED CARD */}
        {hasVoted && (
          <VoteRegisteredLgContainer>
            <VoteRegisteredCard explorerLink={explorerLink} />
          </VoteRegisteredLgContainer>
        )}
      </VotingCard>

      {/* MODALS */}
      <ConfirmModal
        isOpen={confirmModalOpened}
        onVoted={handleOnVoted}
        onClose={handleBackToVoting}
      />
      <DisconnectModal
        hideCloseButton
        isOpen={disconnectModalOpened}
        onRequestClose={() => setDisconnectModalOpened(false)}
        onDisconnect={handleLogOut}
      />
    </>
  )
}
const makeShowMoreIcon = (alt: string) => (
  <img
    src="/images/vote/show-more.svg"
    alt={alt}
  />
)
const makeVoteResultsIcon = (alt: string) =>
(
  <img
    src="/images/vote/vote-results.svg"
    alt={alt}
  />
)
const makeAuthenticateIcon = (alt: string) => (
  <img
    src="/images/vote/authenticate-icon.svg"
    alt={alt}
  />
)
const makeAuthenticateBannerImage = (alt: string) => (
  <img
    src="/images/vote/authenticate-banner-image.svg"
    alt={alt}
  />
)
const makeDisconnectIcon = (alt: string) => (
  <img
    src="/images/vote/disconnect-icon.svg"
    alt={alt}
  />
)
const makeSeeResultsIcon = (alt: string) => (
  <img
    src="/images/vote/chevron-right.svg"
    alt={alt}
    height="10px"
    width="10px"
  />
)

const VotingCard = styled(PageCard)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin: -20px -15px 0 -15px;
  }
`

const VoteRegisteredLgContainer = styled.div`
  display: none;

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: block;
  }
`

const PlayerFixedContainer = styled.div<IVideoStyle>`
  position: absolute;
  margin-bottom: 20px;
  margin:0;
  z-index: 30;
  transition: all 0.4s ease-in-out;
  top: ${({ top }) => top || 0}px;
  height: ${({ height }) => height || 300}px;
  width: ${({ width }) => width + 'px' || '100%'};
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
`

const BodyContainer = styled.div`
  position: relative;
`

const FixedButtonContainer = styled.div`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 31;
  background-color: ${(props) => props.theme.white};
  padding: 28px 10px;
  box-shadow: 1px 1px 9px #8f8f8f;

  & > div {
    margin: 0 auto;
    max-width: 330px;
  }

  @media ${({ theme }) => theme.screenMin.tablet} {
    display: none;
  }
`

const StickyCol = styled(Col) <IColProps>`
  position: sticky;
  top: 20px;
`

const SubmitButtonContainer = styled(FlexContainer)`
  margin: 30px 0 20px;
`
const TextContainer = styled(Body1)`
  margin: 12px 0;
`

const FixedContainerRow = styled(Row)`
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 31;
  background-color: rgba(13, 71, 82, 0.85);
  min-height: 72px;
  backdrop-filter: blur(8px);
  @media ${({ theme }) => theme.screenMin.tablet} {
    display: none;
  }
`
const VoteNowFixedContainer = styled(FixedContainerRow)`
  padding: 24px;
`
const MobileSpacer = styled.div`
min-height: 72px;
@media ${({ theme }) => theme.screenMin.tablet} {
  display: none;
}
`
// const StyledTextButton = styled(TextButton)`
//   margin: 4px;
// `
