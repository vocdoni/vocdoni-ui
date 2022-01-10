import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import { useBlockStatus, useEntity, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { If, Then, Else } from 'react-if'

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
export enum VotingState {
  NotStarted = 'notStarted',
  Started = 'started',
  Ended = 'ended',
  Guest = 'guest',
  Expired = 'expired',
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
  const { getDateDiffString } = useCalendar()
  const { methods: votingMethods, choices, hasVoted, results, nullifier } = useVoting(
    processId
  )
  const { process: processInfo } = useProcess(processId)
  const { startDate, endDate, status, liveResults } = useProcessWrapper(processId)
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const [isExpandableCardOpen, setIsExpandableCardOpen] = useState<boolean>(false)
  const [votingState, setVotingState] = useState<VotingState>(
    VotingState.NotStarted
  )
  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(processInfo?.state, blockHeight)
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier
  const entityMetadata = metadata as EntityMetadata
  const resultsCardRef = useRef(null)

  useEffect(() => {
    if (hasVoted) {
      return setVotingState(VotingState.Ended)
    }

    if (
      voteStatus === VoteStatus.Ended ||
      voteStatus === VoteStatus.Canceled ||
      voteStatus === VoteStatus.Upcoming
    ) {
      return setVotingState(VotingState.Expired)
    }

    if (!wallet) {
      return setVotingState(VotingState.Guest)
    }

    setVotingState(VotingState.NotStarted)
  }, [wallet, hasVoted])

  useEffect(() => {
    if (
      processInfo?.metadata?.meta?.[MetadataFields.BrandColor] ||
      entityMetadata?.meta?.[MetadataFields.BrandColor]
    ) {
      const brandColor =
        processInfo?.metadata?.meta?.[MetadataFields.BrandColor] ||
        entityMetadata?.meta?.[MetadataFields.BrandColor]

      updateAppTheme({
        accent1: brandColor,
        accent1B: brandColor,
        accent2: brandColor,
        accent2B: brandColor,
        textAccent1: brandColor,
        textAccent1B: brandColor,
        customLogo: entityMetadata?.media?.logo,
      })
    }
  }, [processInfo, entityMetadata])


  const handleVoteNow = () => {
    if (votingState == VotingState.NotStarted) {
      setVotingState(VotingState.Started)
    } else if (votingState == VotingState.Guest) {
      handleGotoAuth()
    }
  }
  const handleSeeResultsClick = () => {
    setIsExpandableCardOpen(true)
    resultsCardRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }
  const handleExpandableCardButtonClick = () => {
    setIsExpandableCardOpen(!isExpandableCardOpen)
  }

  // const handleFinishVote = () => {
  //   setConfirmModalOpened(true)
  // }

  // const handleBackToDescription = () => {
  //   setVotingState(VotingState.NotStarted)
  // }

  const handleBackToVoting = () => {
    setVotingState(VotingState.Started)
    setConfirmModalOpened(false)
  }

  const handleOnVoted = () => {
    setVotingState(VotingState.Ended)
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
  const endingString = getDateDiffString(null, endDate)
  const startingString = getDateDiffString(null, startDate)
  const processVotingType: VotingType = processInfo?.state?.censusOrigin as any


  const showResults =
    votingState === VotingState.Guest || votingState === VotingState.Ended


  const totalVotes =
    VotingType.Weighted === processVotingType
      ? results?.totalWeightedVotes
      : results?.totalVotes

  const showDisconnectBanner = wallet && status === VoteStatus.Upcoming && voteStatus == VoteStatus.Active
  const showNotAuthenticatedBanner = !wallet && status == VoteStatus.Active

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
        <BodyContainer>
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
              <VoteDescription/>
            </Col>
            {/* VOTE CARD */}
            <StickyCol xs={12} md={3} hiddenSmAndDown disableFlex>
              <VoteActionCard
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

        {/* FIXED CARDS ON MOBILE VERSION */}

        {voteStatus === VoteStatus.Upcoming &&
          <FixedContainerRow align='center' justify='center'>
            <Col>
              <Text size='lg' color='white'>
                {i18n.t('vote.vote_will_start')}&nbsp;<b>{startingString}</b>
              </Text>
            </Col>
          </FixedContainerRow>
        }

        {voteStatus === VoteStatus.Active &&
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
// const StyledTextButton = styled(TextButton)`
//   margin: 4px;
// `
