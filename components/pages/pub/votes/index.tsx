import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'

import { useBlockStatus, useEntity, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { If, Then, Else } from 'react-if'

import { VotingType, Choice, Question  } from '@lib/types'
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
import { INDEXER_PATH} from '@const/routes'
import { ExpandableCard } from '@components/blocks/expandable-card'
import { Banner } from '@components/blocks-v2/banner'
import { Spacer, Col, Row, IColProps, Text } from '@components/elements-v2'
import { colors } from 'theme/colors'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Radio } from '@components/elements/radio'

import { DisconnectModal } from '@components/blocks-v2'
import { ResultsCard } from './components/results-card'
import { useProcessWrapper } from '@hooks/use-process-wrapper'
import { useIsMobile } from '@hooks/use-window-size'
import { PieChartIcon, LogOutIcon, LogOutIconWhite } from '@components/elements-v2/icons'
import { dateDiffStr, DateDiffType } from '@lib/date-moment'
import { MetadataFields } from '@components/pages/votes/new/metadata'
import { useAuthForm } from '@hooks/use-auth-form'
import { Symmetric } from 'dvote-js'
import { CspSMSAuthenticator } from '@vocdoni/csp'
import { useCSPForm } from '@hooks/use-csp-form'
import copy from 'copy-to-clipboard'
import { useMessageAlert } from '@hooks/message-alert'
import { useAdobeAnalytics } from '@hooks/adobe-analytics'

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
  const { consumed } = useCSPForm()

  const { methods: votingMethods, choices, hasVoted, results, explorerLink, nullifier } = useVoting(
    processId
  )
  const { process: processInfo } = useProcess(processId)
  const { startDate, endDate, status, liveResults, votingType, isAnonymous } = useProcessWrapper(processId)
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const [isExpandableCardOpen, setIsExpandableCardOpen] = useState<boolean>(false)
  const {methods:adobe} = useAdobeAnalytics()
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
  // const [now, setNow] = useState(new Date)
  const [anonymousFormData, setAnonymousFormData] = useState('')

  // @TODO move to the params received from the voting creation
  // if TRUE, the voting will display all the questions in one page
  const isInlineVotingProcess = true
  const totalVotes = results?.totalVotes ? results.totalVotes : 0

  // Effects

  // If status is ended open the results card
  // automatically
  useEffect(() => {
    if (status == VoteStatus.Ended) {
      setIsExpandableCardOpen(true)
    }
  }, [status])

  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setNow(new Date)
  //   }, 1000)
  //   return () => clearInterval(interval);
  // }, [])
  const endingString = dateDiffStr(DateDiffType.Countdown, endDate)
  const startingString = dateDiffStr(DateDiffType.Countdown, startDate)
  /**
   * effect to set the user vote status
   */
  useEffect(() => {
    if (!wallet) {
      handleGotoAuth()
    }

    if (consumed || hasVoted) {
      return setUserVoteStatus(UserVoteStatus.Emitted)
    }

    if (
      voteStatus === VoteStatus.Ended ||
      voteStatus === VoteStatus.Canceled ||
      voteStatus === VoteStatus.Upcoming
    ) {
      return setUserVoteStatus(UserVoteStatus.Expired)
    }

    if (isInlineVotingProcess) {
      return setUserVoteStatus(UserVoteStatus.InProgress)
    }

    setUserVoteStatus(UserVoteStatus.NotEmitted)
  }, [wallet, hasVoted])

  useEffect(() => {
    if (wallet) {
      const voterData = localStorage.getItem('voterData')
      if (voterData) {
        const decryptedVoterdata = Symmetric.decryptString(voterData, wallet.publicKey)
        const anonymizedVoterData = anonymizeStrings(decryptedVoterdata.split('/'))
        setAnonymousFormData(anonymizedVoterData.join(' / '))
      }
    }
  }, [wallet])
  /**
   * watcher to update entity theming
   */
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
    adobe.trackPage("/confirmar-vot",window.location.href)
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
    adobe.trackPage("/votacio-confirmada",window.location.href)
    setUserVoteStatus(UserVoteStatus.Emitted)
    setConfirmModalOpened(false)
  }

  const handleGotoAuth = () => {
    setWallet(null)
    votingMethods.cleanup()

    setTimeout(() => {
      router.push(
        RouterService.instance.get(INDEXER_PATH, { processId })
      )
    }, 50)
  }

  const handleLogOut = () => {
    setWallet(null)
    votingMethods.cleanup()

    setTimeout(() => {
      // Force window unload after the wallet is wiped
      setDisconnectModalOpened(false)
      window.location.href = RouterService.instance.get(INDEXER_PATH, { processId })
    }, 50)
  }
  // const processVotingType: VotingType = processInfo?.state?.censusOrigin as any

  const showAuthBanner = (
    status === VoteStatus.Upcoming ||
    status === VoteStatus.Active ||
    status === VoteStatus.Ended
  )
  const showDisconnectBanner = wallet && showAuthBanner
  const showNotAuthenticatedBanner = !wallet && showAuthBanner

  const authenticateBannerImage = (
    makeAuthenticateBannerImage(i18n.t('vote.question_image_alt'), isMobile ? 56 : 88)
  )

  //If only one candidate, no voting allowed
  const isOneCandidate = (processInfo?.metadata?.questions[0].choices.length <= 1)
  const { setAlertMessage } = useMessageAlert()
  const handleCopy = () => {
    copy(nullifier.toString())
    setAlertMessage(i18n.t("copy.the_link_has_been_copied_to_the_clipboard"))
  }

  return (
    <>
      <VotingCard>
        <CardImageHeader
          title={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          subtitle={metadata?.name.default}
          entityImage={metadata?.media.avatar}
          logged={true}
          onLogout={handleGotoAuth}
        />

        { isOneCandidate &&
          <BodyContainer>
            <Spacer direction='vertical' size='3xl' />
            <Spacer direction='vertical' size='3xl' />
            <Spacer direction='vertical' size='3xl' />

            <NoVottingDiv>
              <Typography variant={TypographyVariant.H4} margin="0">
                {processInfo?.metadata?.questions[0].title.default}
              </Typography>

              <Spacer direction='vertical' size='3xl' />

              { (voteStatus === VoteStatus.Active || voteStatus === VoteStatus.Upcoming) &&
                <>
                  <OneCandidateDiv>
                    {i18n.t('fcb.only_one_candidate')}
                  </OneCandidateDiv>

                  <QuestionsContainer>
                    <div key={0}>
                      <div>
                        <OptionsContainer>
                          {/*
                            <Radio
                              name={`question-1`}
                              key={0}
                              checked={false}
                              onClick={() => (0)}
                              disabled={true}
                            >
                              {processInfo?.metadata?.questions[0].choices[0].title.default}
                            </Radio>
                          */}
                          {processInfo?.metadata?.questions[0].choices[0].title.default}
                        </OptionsContainer>
                      </div>
                    </div>
                  </QuestionsContainer>
                </>
              }

              {(voteStatus === VoteStatus.Ended) &&
                <div>
                  <Text size='sm'>
                    {i18n.t('fcb.vote_registered')}
                  </Text>
                  <br />
                </div>
              }

              <Spacer direction='vertical' size='3xl' />

              <Row>
                <LeaveButton onClick={handleLogOut}>
                  {i18n.t('fcb.disconnect_account')}
                  <IconSpacer>
                    <LogOutIconWhite
                      size='16px'
                    />
                  </IconSpacer>
                </LeaveButton>
              </Row>

              <Spacer direction='vertical' size='3xl' />
            </NoVottingDiv>
          </BodyContainer>
        }

        { !isOneCandidate &&
          <>
            <If condition={(userVoteStatus !== UserVoteStatus.InProgress || isInlineVotingProcess)}>
              <Then>
                <BodyContainer>
                  <Row gutter='2xl'>
                    {/* NOT AUTHENTICATED BANNER */}
                    {false && showNotAuthenticatedBanner &&
                      <Col xs={12}>
                        <Banner
                          variant='primary'
                          image={authenticateBannerImage}
                          subtitleProps={
                            {
                              size: isMobile ? 'xs' : 'md',
                              children: isAnonymous ? i18n.t('vote.auth.with_preregistration') : voteStatus === VoteStatus.Ended ? i18n.t('vote.auth.if_you_voted') : i18n.t('vote.auth.with_credentials')
                            }
                          }
                          titleProps={{ size: 'sm' }}
                          buttonProps={
                            {
                              variant: 'primary',
                              children: isAnonymous ? i18n.t('vote.auth.preregister_button') : i18n.t('vote.auth.auth_button'),
                              iconRight: isMobile ? undefined : { name: isAnonymous ? 'paper-check' : 'pencil', size: 24 },
                              onClick: () => handleGotoAuth()
                            }
                          }
                        >
                          {isAnonymous ? i18n.t('vote.auth.not_preregistered') : i18n.t('vote.auth.not_authenticated')}
                        </Banner>
                      </Col>
                    }
                    {/* DISCONNECT BANNER */}
                    {false && showDisconnectBanner &&
                      <Col xs={12} disableFlex>
                        <Banner
                          variant='primary'
                          titleProps={{ weight: 'regular' }}
                          buttonProps={
                            {
                              variant: 'white',
                              children: i18n.t('vote.auth.disconnect_button'),
                              iconRight: isMobile ? undefined : { name: 'lightning-slash' },
                              onClick: () => setDisconnectModalOpened(true)
                            }
                          }
                        >
                          {i18n.t('vote.you_are_autenticated')}
                          <b> {anonymousFormData}</b>
                        </Banner>
                      </Col>
                    }

                    {/* DESCIRPTION */}
                    <Col xs={12} md={12}>
                      <VoteDescription />
                    </Col>

                    {/* VOTE CARD */}
                    {false &&
                      <StickyCol xs={12} md={3} hiddenSmAndDown disableFlex>
                        <VoteActionCard
                          userVoteStatus={userVoteStatus}
                          onClick={handleVoteNow}
                          onSeeResults={handleSeeResultsClick}
                        />
                      </StickyCol>
                    }
                  </Row>

                  <Spacer direction='vertical' size='3xl' />

                  {/* TODO: ADD if guest? */}
                  {voteStatus === VoteStatus.Upcoming &&
                    <>
                      <UpcomingNotice>
                        {i18n.t('fcb.upcoming_vote')}
                      </UpcomingNotice>
                    </>
                  }

                  {/* INLINE QUESTIONS */}
                  <If condition={wallet !== null && isInlineVotingProcess && !hasVoted && !consumed && status === VoteStatus.Active}>
                    <Then>
                      <QuestionsListInline
                        ref={questionsInlineRef}
                        results={choices}
                        questions={processInfo?.metadata?.questions}
                        voteWeight={votingType === VotingType.Weighted ? censusProof?.weight?.toString() : null}
                        onSelect={votingMethods.onSelect}
                        onFinishVote={handleFinishVote}
                        onBackDescription={handleBackToDescription}
                        isDisabled={voteStatus !== VoteStatus.Active}
                      />
                    </Then>
                  </If>
                </BodyContainer>

                <Spacer direction='vertical' size='3xl' />

                <If condition={false && status == VoteStatus.Ended}>
                  <Then>
                    {/* RESULTS CARD */}
                    <BodyContainer>
                      <Row gutter='2xl'>
                        <Col xs={12}>
                          <ResultsCard />
                        </Col>
                      </Row>
                    </BodyContainer>
                  </Then>
                </If>
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

            {false && voteStatus === VoteStatus.Upcoming &&
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

            {false && voteStatus === VoteStatus.Active &&
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
            {false && hasVoted && (
              <VoteRegisteredLgContainer>
                <VoteRegisteredCard explorerLink={explorerLink} />
              </VoteRegisteredLgContainer>
            )}
            {((hasVoted || consumed) && voteStatus === VoteStatus.Active) &&
              <BodyContainer>
                <br />

                <TitleH3>{i18n.t('fcb.you_have_voted')}</TitleH3>
                <div>
                  { (hasVoted) &&
                  <Text size='sm'>
                    {i18n.t('fcb.confirmation_code')} <Nullifier onClick={handleCopy}>{nullifier}</Nullifier>
                  </Text>
                }

                  <Spacer direction='vertical' size='3xl' />

                  <Text size='sm'>
                    {i18n.t('fcb.vote_registered')}
                  </Text>

                  <Spacer direction='vertical' size='3xl' />
                </div>

                <Spacer direction='vertical' size='3xl' />
                <br />

                <Row>
                  <LeaveButton onClick={handleLogOut}>
                    {i18n.t('fcb.disconnect_account')}
                    <IconSpacer>
                      <LogOutIconWhite
                        size='16px'
                      />
                    </IconSpacer>
                  </LeaveButton>
                </Row>

                <Spacer direction='vertical' size='3xl' />
              </BodyContainer>
            }

            {(voteStatus === VoteStatus.Ended) &&
              <BodyContainer>
                { hasVoted &&
                  <>
                    <Typography variant={TypographyVariant.H4} margin="0">
                      {processInfo?.metadata?.questions[0].title.default}
                    </Typography>
                    <Spacer direction='vertical' size='3xl' />
                    <TitleH3>{i18n.t('fcb.you_have_voted')}</TitleH3>
                    <div>
                      <Text size='sm'>
                        {i18n.t('fcb.confirmation_code')} <Nullifier onClick={handleCopy}>{nullifier}</Nullifier>
                      </Text>
                      <Text size='sm'>
                        {i18n.t('fcb.vote_registered')}
                      </Text>
                      <br /><br /><br />
                    </div>
                  </>
                }

                { !hasVoted &&
                  <>
                    <Typography variant={TypographyVariant.H4} margin="0">
                      {processInfo?.metadata?.questions[0].title.default}
                    </Typography>
                    <Spacer direction='vertical' size='3xl' />
                    <TitleH3>{i18n.t('vote.ended_vote')}</TitleH3>
                    <div>
                      <Text size='sm'>
                        {i18n.t('fcb.vote_registered')}
                      </Text>
                      <br /><br /><br />
                    </div>
                  </>
                }

                <Spacer direction='vertical' size='3xl' />

                <Row>
                  <LeaveButton onClick={handleLogOut}>
                    {i18n.t('fcb.disconnect_account')}
                    <IconSpacer>
                      <LogOutIconWhite
                        size='16px'
                      />
                    </IconSpacer>
                  </LeaveButton>
                </Row>

                <Spacer direction='vertical' size='xl' />
              </BodyContainer>
            }
          </>
        }
      </VotingCard>
      {/* MODALS */}
      <ConfirmModal
        isOpen={confirmModalOpened}
        onVoted={handleOnVoted}
        onClose={handleBackToVoting}
        sendSMS={votingMethods.sendSMS}
        submitOTP={votingMethods.submitOTP}
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

const Nullifier = styled.div`
  display: inline-block;
  word-wrap: break-word;
  font-weight: 600;
  font-size: 12px;
  color: #333;
  cursor: pointer;
  margin-top: 10px;
  padding: 10px;
  border-radius: 8px;
  border: 1px solid #eee;
  background: #fafafa;
  word-wrap: anywhere;
`

const OneCandidateDiv = styled.div`
  font-size: 18px;
  font-weight: 600;
`

const NoVottingDiv = styled.div`
  padding: 0px 10px;
  margin-top: 50px;
  margin-bottom: 20px;
`

const QuestionsContainer = styled.div`
  overflow-y: hidden;
  overflow-x: hidden;
  max-height: 300px;

  @media ${({theme}) => theme.screenMax.mobileL} {
    max-height: 260px;
  }
`

const OptionsContainer = styled.div`
  margin-bottom: 40px;
  margin-top: 40px;
  font-size: 18px;
`

export const IconSpacer = styled.div`
  padding-left: 8px;
  padding-top: 2px;
  display: inline-block;
  line-height: 20px;
`

export const LeaveButton = styled.div`
  box-shadow: 0px 6px 6px rgba(180, 193, 228, 0.35);
  border-radius: 8px;
  white-space: nowrap;
  user-select: none;
  box-sizing: border-box;
  text-align: center;
  color: #fff;

  cursor: pointer;
  min-width: 173px;
  border-radius: 4px;
  background: #CF122D;
  font-weight: 700;
  font-size: 16px;
  padding: 12px 24px;
  width: 100%;
  max-width: 300px;

  &:hover {
      background: #CF122D;
  }
  &:active {
      background: #CF122D;
  }
`

const TextVerticalCentered = styled(Text)`
  padding-top: 13px;
`

const VotingCard = styled(PageCard)`
  max-width: 946px;
  margin: 0px auto;

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

const BodyContainer = styled.div`
  position: relative;
  max-width: 704px;
  margin:0px auto;
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
const UpcomingNotice = styled.div`
  font-size: 20px;
  padding: 20px 30px;
  border: 2px solid #2E377A;
  border-radius: 12px;
  font-weight: 700;
`

const TitleH3 = styled.h3`
  font-family: 'Manrope';
  font-style: normal;
  font-weight: 700;
  font-size: 20px;
  line-height: 150%;
  color: #0D4752;
`
