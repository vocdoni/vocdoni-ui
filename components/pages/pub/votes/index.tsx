import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useBlockStatus, useEntity, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { If, Then, Else } from 'react-if'

import { VotingType } from '@lib/types'
import { useTheme } from '@hooks/use-theme'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'
import { PageCard } from '@components/elements/cards'
import { Button } from '@components/elements-v2/button'
import { CardImageHeader } from '@components/blocks/card/image-header'
import { VoteDescription } from '@components/blocks/vote-description'
import { ConfirmModal } from './components/confirm-modal'
import { VoteActionCard } from './components/vote-action-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { useUrlHash } from 'use-url-hash'
import { QuestionsList } from './components/questions-list'
import { QuestionsListInline } from './components/questions-list-inline'
import { censusProofState } from '@recoil/atoms/census-proof'
import { VoteRegisteredCard } from './components/vote-registered-card'
import RouterService from '@lib/router'
import { VOTING_AUTH_FORM_PATH } from '@const/routes'
import { ExpandableCard } from '@components/blocks/expandable-card'
import { Banner } from '@components/blocks-v2/banner'
import { Spacer, Col, Row, IColProps, Text } from '@components/elements-v2'

import { DisconnectModal } from '@components/blocks-v2'
import { ResultsCard } from './components/results-card'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useIsMobile } from '@hooks/use-window-size'
import { PieChartIcon } from '@components/elements-v2/icons'
import { dateDiffStr, DateDiffType } from '@lib/date-moment'
import { MetadataFields } from '@components/pages/votes/new/metadata'
import { useAuthForm } from '@hooks/use-auth-form'
import { Symmetric } from 'dvote-js'
export enum UserVoteStatus {
  /**
   * User is voting right now
   */
  InProgress = 'inProgress',
  /**
   * User vote has expired due to external
   * things like the vote is closed
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
  const { updateAppTheme } = useTheme()
  const router = useRouter()
  const [disconnectModalOpened, setDisconnectModalOpened] = useState(false)
  const isMobile = useIsMobile()
  const censusProof = useRecoilValue(censusProofState)
  const { methods: votingMethods, choices, hasVoted, results, explorerLink } = useVoting(
    processId
  )
  const { process: processInfo } = useProcess(processId)
  const { startDate, endDate, status, liveResults, votingType, isAnonymous } = useProcessWrapper(processId)
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
  // const entityMetadata = metadata as EntityMetadata
  const resultsCardRef = useRef(null)
  const questionsInlineRef = useRef(null)
  // used for getting the ending in and starting in string
  const [now, setNow] = useState(new Date)

  // @TODO move to the params received from the voting creation
  // if TRUE, the voting will display all the questions in one page
  const isInlineVotingProcess = false

  // Effects

  // If status is ended open the results card
  // automatically
  useEffect(() => {
    if (status == VoteStatus.Ended) {
      setIsExpandableCardOpen(true)
    }
  }, [status])

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date)
    }, 1000)
    return () => clearInterval(interval);
  }, [])
  const endingString = dateDiffStr(DateDiffType.Countdown, endDate)
  const startingString = dateDiffStr(DateDiffType.Countdown, startDate)
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

    if(isInlineVotingProcess) {
      return setUserVoteStatus(UserVoteStatus.InProgress)
    }

    setUserVoteStatus(UserVoteStatus.NotEmitted)
  }, [wallet, hasVoted])

  useEffect(() => {
    if (
      processInfo?.metadata?.meta?.[MetadataFields.BrandColor] ||
      metadata?.meta?.[MetadataFields.BrandColor]
    ) {
      const brandColor =
        processInfo?.metadata?.meta?.[MetadataFields.BrandColor] ||
        metadata?.meta?.[MetadataFields.BrandColor]

      updateAppTheme({
        accent1: brandColor,
        accent1B: brandColor,
        accent2: brandColor,
        accent2B: brandColor,
        textAccent1: brandColor,
        textAccent1B: brandColor,
        customLogo: metadata?.media?.logo,
      })
    }
  }, [processInfo, metadata])


  const handleVoteNow = () => {
    if (userVoteStatus === UserVoteStatus.NotEmitted) {
      setUserVoteStatus(UserVoteStatus.InProgress)
    }
    if (userVoteStatus === UserVoteStatus.Guest) {
      handleGotoAuth()
    }
    if(isInlineVotingProcess){
      setTimeout(() => {
        questionsInlineRef.current.scrollIntoView({ block: 'start', behavior: 'smooth' })
      }, 200)
      return
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
  // const processVotingType: VotingType = processInfo?.state?.censusOrigin as any

  const showAuthBanner = (
    status === VoteStatus.Upcoming ||
    status === VoteStatus.Active ||
    status === VoteStatus.Ended
  )

  const needsPregistration = isAnonymous && status === VoteStatus.Upcoming
  const showDisconnectBanner = wallet && showAuthBanner
  const showNotAuthenticatedBanner = !wallet && showAuthBanner

  const authenticateBannerImage = (
    makeAuthenticateBannerImage(i18n.t('vote.question_image_alt'), isMobile ? 56 : 72)
  )

  return (
    <>
      {/* NOT AUTHENTICATED BANNER */}
      {showNotAuthenticatedBanner &&
        <>
          <Row gutter='2xl'>
            <Col xs={12}>
              <ShadowBanner>
                <Banner
                  variant='gray'
                  image={authenticateBannerImage}
                  subtitleProps={
                    {
                      size: 'xs',
                      children: isAnonymous ? ( voteStatus === VoteStatus.Ended ? i18n.t('vote.auth.if_you_voted') : ( voteStatus === VoteStatus.Active ? i18n.t('vote.auth.with_preregistration_active') : i18n.t('vote.auth.with_preregistration') )) : voteStatus === VoteStatus.Ended ? i18n.t('vote.auth.if_you_voted') : i18n.t('vote.auth.with_credentials')
                    }
                  }
                  titleProps={{ size: 'sm' }}
                  buttonProps={
                    {
                      variant: 'primary',
                      children: needsPregistration ? i18n.t('vote.auth.preregister_button') : i18n.t('vote.auth.auth_button'),
                      iconRight: isMobile ? undefined : { name: isAnonymous ? 'paper-check' : 'pencil', size: 24 },
                      onClick: () => handleGotoAuth()
                    }
                  }
                  twoRows={true}
                >
                  { needsPregistration ? i18n.t('vote.auth.not_preregistered') : i18n.t('vote.auth.not_authenticated')}
                </Banner>
              </ShadowBanner>
            </Col>
          </Row>
          <br />
        </>
      }

      {/* DISCONNECT BANNER */}
      {showDisconnectBanner &&
        <Col xs={12} hiddenMdAndUp disableFlex>
          <Row>
            <Col xs={12} disableFlex>
              <ShadowBanner>
                <Banner
                  variant='outlined'
                  titleProps={{ weight: 'regular', align: 'center'}}
                  buttonProps={
                    {
                      variant: 'white',
                      children: i18n.t('vote.auth.disconnect_button'),
                      iconRight: isMobile ? undefined : { name: 'lightning-slash' },
                      onClick: () => setDisconnectModalOpened(true)
                    }
                  }
                >
                  <CenteredText>{i18n.t('vote.you_are_autenticated')}</CenteredText>
                </Banner>
              </ShadowBanner>
            </Col>
          </Row>
          <br />
        </Col>
      }

      <VotingCard>
        <CardImageHeader
          title={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          subtitle={metadata?.name.default}
          entityImage={metadata?.media.avatar}
          isHeaderExpanded={true}
        />
        <If condition={(userVoteStatus !== UserVoteStatus.InProgress) || isInlineVotingProcess}>
          <Then>
            <BodyContainer >
              <Row gutter='2xl'>
                {/* DESCIRPTION */}
                <Col xs={12} md={9}>
                  <VoteDescription />

                  {/* INLINE QUESTIONS */}
                  <If condition={isInlineVotingProcess && (status === VoteStatus.Upcoming || status === VoteStatus.Active) && userVoteStatus !== UserVoteStatus.Emitted}>
                    <Then>
                      <Row>
                        <Col xs={12}>
                          <Text variant="title" weight='regular'>{i18n.t("vote_detail.questions_card.title")}</Text>
                          <QuestionsListInline
                            ref={questionsInlineRef}
                            results={choices}
                            questions={processInfo?.metadata?.questions}
                            voteWeight={votingType === VotingType.Weighted ? censusProof?.weight?.toString() : null}
                            onSelect={votingMethods.onSelect}
                            onFinishVote={handleFinishVote}
                            onBackDescription={handleBackToDescription}
                            authenticated={wallet ? true : false}
                          />
                        </Col>
                      </Row>
                    </Then>
                  </If>
                </Col>

                {/* VOTE CARD */}
                <StickyCol xs={12} md={3} hiddenSmAndDown disableFlex>

                  {/* NOT AUTHENTICATED BANNER */}
                  {false && showNotAuthenticatedBanner &&
                    <>
                      <Row gutter='2xl'>
                        <Col xs={12}>
                          <ShadowBanner>
                            <Banner
                              variant='gray'
                              image={authenticateBannerImage}
                              subtitleProps={
                                {
                                  size: 'xs',
                                  children: isAnonymous ? ( voteStatus === VoteStatus.Ended ? i18n.t('vote.auth.if_you_voted') : ( voteStatus === VoteStatus.Active ? i18n.t('vote.auth.with_preregistration_active') : i18n.t('vote.auth.with_preregistration') )) : voteStatus === VoteStatus.Ended ? i18n.t('vote.auth.if_you_voted') : i18n.t('vote.auth.with_credentials')
                                }
                              }
                              titleProps={{ size: 'sm' }}
                              buttonProps={
                                {
                                  variant: 'primary',
                                  children: needsPregistration ? i18n.t('vote.auth.preregister_button') : i18n.t('vote.auth.auth_button'),
                                  iconRight: isMobile ? undefined : { name: isAnonymous ? 'paper-check' : 'pencil', size: 24 },
                                  onClick: () => handleGotoAuth()
                                }
                              }
                            >
                              { needsPregistration ? i18n.t('vote.auth.not_preregistered') : i18n.t('vote.auth.not_authenticated')}
                            </Banner>
                          </ShadowBanner>
                        </Col>
                      </Row>
                      <br />
                    </>
                  }

                  {/* DISCONNECT BANNER */}
                  {showDisconnectBanner &&
                    <>
                      <Row gutter='2xl'>
                        <Col xs={12} disableFlex>
                          <ShadowBanner>
                            <Banner
                              variant='primary'
                              titleProps={{ weight: 'regular', size: 'sm', align: 'center'}}
                              buttonProps={
                                {
                                  variant: 'white',
                                  children: i18n.t('vote.auth.disconnect_button'),
                                  iconRight: isMobile ? undefined : { name: 'lightning-slash' },
                                  onClick: () => setDisconnectModalOpened(true)
                                }
                              }
                            >
                              <CenteredText>{i18n.t('vote.you_are_autenticated')}</CenteredText>
                            </Banner>
                          </ShadowBanner>
                        </Col>
                      </Row>
                      <br />
                    </>
                  }

                  <VoteActionCard
                    userVoteStatus={userVoteStatus}
                    onClick={handleVoteNow}
                    onSeeResults={handleSeeResultsClick}
                    isOnlineVoting={isInlineVotingProcess}
                  />
                </StickyCol>
              </Row>

              <Spacer direction='vertical' size='3xl' />

              {/* INLINE QUESTIONS */}
              <If condition={isInlineVotingProcess && userVoteStatus !== UserVoteStatus.Emitted}>
                <Then>
                  <Text variant="title" weight='regular'>{i18n.t("vote_detail.questions_card.title")}</Text>
                  <QuestionsListInline
                    ref={questionsInlineRef}
                    results={choices}
                    questions={processInfo?.metadata?.questions}
                    voteWeight={votingType === VotingType.Weighted ? censusProof?.weight?.toString() : null}
                    onSelect={votingMethods.onSelect}
                    onFinishVote={handleFinishVote}
                    onBackDescription={handleBackToDescription}
                    authenticated={wallet ? true : false}
                  />
                </Then>
              </If>
            </BodyContainer>

            <Spacer direction='vertical' size='3xl' />

            {/* RESULTS CARD */}
            <Row gutter='2xl'>
              <Col xs={12}>
                <ExpandableCard
                  ref={resultsCardRef}
                  isOpen={isExpandableCardOpen}
                  onButtonClick={handleExpandableCardButtonClick}
                  title={i18n.t("vote.voting_results_title")}
                  icon={<PieChartIcon size={40} />}
                  buttonProps={{
                    variant: 'white',
                    iconRight: { name: 'chevron-up-down', size: 24 },
                    children: i18n.t("vote.voting_results_show")
                  }}
                  buttonPropsOpen={{
                    variant: 'white',
                    iconRight: { name: 'chevron-up-down', size: 24 },
                    children: i18n.t("vote.voting_results_hide")
                  }}
                >
                  <ResultsCard />
                </ExpandableCard>
              </Col>
            </Row>

            <Spacer direction='vertical' size='2xl' />
          </Then>
          <Else>
            <QuestionsList
              results={choices}
              questions={processInfo?.metadata?.questions}
              voteWeight={votingType === VotingType.Weighted ? censusProof?.weight?.toString() : null}
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

        {(voteStatus === VoteStatus.Active && (userVoteStatus !== UserVoteStatus.InProgress && userVoteStatus !== UserVoteStatus.Emitted)) &&
          <>
            <MobileSpacer />
            <VoteNowFixedContainer justify='center' align='center' gutter='md'>
              <Col xs={12} justify='center'>
                <Text size='lg' color='white'>
                  {i18n.t('vote.vote_will_close')}&nbsp;<b>{endingString}</b>
                </Text>
              </Col>
              { !isInlineVotingProcess &&
                <Col xs={12}>
                  <Button variant='primary' size='lg' onClick={handleVoteNow}>
                    {i18n.t("vote.vote_now")}
                  </Button>
                </Col>
              }
              <Col xs={12} justify='center'>
                <Spacer direction='vertical' size='2xs' />
                <Button
                  variant='text'
                  iconRight={{ name: 'chevron-right', size: 16 }}
                  onClick={handleSeeResultsClick}
                >
                  {i18n.t("vote.see_results")}
                </Button>
                <Spacer direction='vertical' size='2xs' />
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

      <Spacer direction='vertical' size='5xl' />
      <br />
    </>
  )
}

const makeAuthenticateBannerImage = (alt: string, size: number) => (
  <img
    src="/images/vote/authenticate-banner-image.svg"
    width={size}
    height={size}
    alt={alt}
  />
)

function anonymizeStrings(strings: string[]): string[] {
  let anonymizedStrings = []
  let iter = 0
  strings.every((str) => {
    if (iter >= 3) {
      return false
    }
    let anonymizedString
    iter = iter + 1
    const emailRegex = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    // check if is an email to preserve the domain
    if (str.toLocaleLowerCase().match(emailRegex)) {
      anonymizedString = `${str[0]}...${str.split('@')[1]}`
      // if is no email and length > 3 compute visible string length
    } else if (str.length >= 3) {
      const visibleStrLength = Math.floor(Math.sqrt(str.length))
      anonymizedString = `${str.substring(0, visibleStrLength)}...${str.substring(str.length - visibleStrLength - 1, visibleStrLength)}`
      // if length is lowhe than 3 use the full string
    } else {
      anonymizedString = str
    }
    anonymizedStrings.push(anonymizedString)
    return true
  })
  return anonymizedStrings
}


const VotingCard = styled(PageCard)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    margin: -20px -15px 0 -15px;
  }

  box-shadow: 0px 3px 3px rgba(180,193,228,0.55);
`

const VoteRegisteredLgContainer = styled.div`
  display: none;

  @media ${({ theme }) => theme.screenMax.tablet} {
    display: block;
  }
`

const BodyContainer = styled.div`
  position: relative;
`

const StickyCol = styled(Col) <IColProps>`
  position: sticky;
  top: 20px;
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

const MobileSpacer1 = styled.div`
  min-height: 42px;
  @media ${({ theme }) => theme.screenMin.tablet} {
    display: none;
  }
`

const ShadowBanner = styled.div`
  box-shadow: 0px 4px 8px rgba(31,41,51,0.04),0px 0px 2px rgba(31,41,51,0.06),0px 0px 1px rgba(31,41,51,0.04) !important;
  border-radius: 16px;
  min-width:250px;
`

const CenteredText = styled.p`
  min-width: 100%;
  text-align: center;
  font-size: 16px;
  font-weight: 600;
  color: #666 !important;
  min-width: 260px;
`
