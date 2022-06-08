import React, { useState, useEffect, useRef } from 'react'
import { useRecoilValue } from 'recoil'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import { useBlockStatus, useEntity, useProcess } from '@vocdoni/react-hooks'
import { useRouter } from 'next/router'
import { If, Then } from 'react-if'

import { Question, VotingType } from '@lib/types'

import { useTheme } from '@hooks/use-theme'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { Column, Grid } from '@components/elements/grid'
import { Card, CardDiv, PageCard } from '@components/elements/cards'
import { Button } from '@components/elements/button'
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
import { QuestionsListInline } from './components/questions-list-inline'
import { censusProofState } from '@recoil/atoms/census-proof'
import { VoteRegisteredCard } from './components/vote-registered-card'
import RouterService from '@lib/router'
import { VOTING_AUTH_FORM_PATH } from '@const/routes'

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
  const { updateAppTheme } = useTheme()
  const censusProof = useRecoilValue(censusProofState)
  const { methods: votingMethods, choices, hasVoted, results, nullifier } = useVoting(
    processId
  )
  const { process: processInfo } = useProcess(processId)
  const { wallet, setWallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const [votingState, setVotingState] = useState<VotingState>(
    VotingState.NotStarted
  )

  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(processInfo?.state, blockHeight)
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier
  const entityMetadata = metadata as EntityMetadata
  const descriptionVideoContainerRef = useRef<HTMLDivElement>(null)
  const votingVideoContainerRef = useRef<HTMLDivElement>(null)

  const timeoutRef = useRef<any>()
  const intervalRef = useRef<any>()
  const [videosStyle, setVideoStyle] = useState<IVideoStyle>({
    height: 0,
    width: 0,
    top: 0,
  })

  const handleVideoPosition = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
    }

    timeoutRef.current = setTimeout(() => {
      const currentRef =
        descriptionVideoContainerRef.current || votingVideoContainerRef.current

      if (currentRef) {
        const newVideoStyle = {
          top: currentRef.offsetTop,
          height: currentRef.offsetHeight,
          width: currentRef.offsetWidth,
        }

        setVideoStyle(newVideoStyle)
      }
    }, 100)
  }

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      handleVideoPosition()
    }, 1000)

    return () => {
      clearInterval(intervalRef.current)
    }
  }, [])

  useEffect(() => {
    window.addEventListener('resize', handleVideoPosition)

    return () => {
      window.removeEventListener('resize', handleVideoPosition)
    }
  }, [votingState])

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

  let dateDiffStr = ''

  if (
    processInfo?.state?.startBlock &&
    (voteStatus == VoteStatus.Active ||
      voteStatus == VoteStatus.Paused ||
      voteStatus == VoteStatus.Ended)
  ) {
    if (processInfo?.state?.startBlock > blockHeight) {
      const date = VotingApi.estimateDateAtBlockSync(
        processInfo?.state?.startBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.Start, date)
    } else {
      // starting in the past
      const date = VotingApi.estimateDateAtBlockSync(
        processInfo?.state?.endBlock,
        blockStatus
      )
      dateDiffStr = localizedStrDateDiff(DateDiffType.End, date)
    }
  }

  const handleVoteNow = () => {
    if (votingState == VotingState.NotStarted) {
      if(showInlineQuestions){
        var element = document.getElementById("voteNow");
        element.scrollIntoView({
          block: 'start',
          behavior: 'smooth'
        });
      } else {
        setVotingState(VotingState.Started)
      }
    } else if (votingState == VotingState.Guest) {
      handleGotoAuth()
    }
  }

  const handleFinishVote = () => {
    setConfirmModalOpened(true)
  }

  const handleBackToDescription = () => {
    setVotingState(VotingState.NotStarted)
  }

  const handleBackToVoting = () => {
    if(!showInlineQuestions){
      setVotingState(VotingState.Started)
    }
    setConfirmModalOpened(false)
  }

  const handleOnVoted = () => {
    setVotingState(VotingState.Ended)
    setConfirmModalOpened(false)

    setWallet(null)
    //votingMethods.cleanup()
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
    const confirmMsg = i18n.t('confirm.do_you_want_to_continue')
    if (!confirm(confirmMsg)) return

    setWallet(null)
    votingMethods.cleanup()

    setTimeout(() => {
      // Force window unload after the wallet is wiped
      window.location.href = RouterService.instance.get(VOTING_AUTH_FORM_PATH, { processId })
    }, 50)
  }

  const processVotingType: VotingType = processInfo?.state?.censusOrigin as any

  const showDescription =
    votingState === VotingState.NotStarted ||
    votingState === VotingState.Ended ||
    votingState === VotingState.Guest

  const showInlineQuestions = 
    votingState !== VotingState.Guest &&
    voteStatus === 0

  const showResults =
    votingState === VotingState.Guest || voteStatus === 2 || (voteStatus === 1 && hasVoted)

  const showVotingButton = votingState == VotingState.NotStarted

  const showLogInButton = votingState == VotingState.Guest

  const voteWeight =
    VotingType.Weighted === processVotingType ? censusProof?.weight : null

  const totalVotes =
    VotingType.Weighted === processVotingType
      ? results?.totalWeightedVotes
      : results?.totalVotes

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
          {showDescription && (
            <Grid>
              <Column sm={12} md={9}>
                <VoteDescription
                  onComponentMounted={handleVideoPosition}
                  ref={descriptionVideoContainerRef}
                  description={processInfo?.metadata?.description.default}
                  hasVideo={!!processInfo?.metadata?.media.streamUri}
                  onLogOut={handleLogOut}
                  discussionUrl={
                    processInfo?.metadata?.meta[MetadataFields.DiscussionLink]
                  }
                  attachmentUrl={
                    processInfo?.metadata?.meta[MetadataFields.AttachmentLink]
                  }
                  timeComment={dateDiffStr}
                  voteStatus={voteStatus}
                />
              </Column>

              
              <Column sm={12} md={3} hiddenSm hiddenMd>
                <VoteNowCardContainer>
                  <VoteActionCard
                    onClick={handleVoteNow}
                    onLogOut={handleLogOut}
                    votingState={votingState}
                    explorerLink={explorerLink}
                    disabled={voteStatus !== VoteStatus.Active}
                  />
                </VoteNowCardContainer>
              </Column>
            </Grid>
          )}

          {processInfo?.metadata?.media.streamUri && (
            <PlayerFixedContainer
              top={videosStyle.top}
              height={videosStyle.height}
              width={videosStyle.width}
            >
              <PlayerContainer>
                <ReactPlayer
                  url={processInfo?.metadata?.media.streamUri}
                  width="100%"
                  height="100%"
                />
              </PlayerContainer>
            </PlayerFixedContainer>
          )}
        </BodyContainer>

        {votingState == VotingState.Started && (
          <QuestionsList
            onComponentMounted={handleVideoPosition}
            ref={votingVideoContainerRef}
            hasVideo={!!processInfo?.metadata?.media.streamUri}
            results={choices}
            questions={processInfo?.metadata?.questions}
            voteWeight={voteWeight}
            onSelect={votingMethods.onSelect}
            onFinishVote={handleFinishVote}
            onBackDescription={handleBackToDescription}
          />
        )}

        {showVotingButton && false && (
          <FixedButtonContainer>
            <div>
              <Button
                large
                positive
                wide
                onClick={handleVoteNow}
                disabled={voteStatus !== VoteStatus.Active}
              >
                {i18n.t('vote.vote_now')}
              </Button>
            </div>
          </FixedButtonContainer>
        )}

        {showLogInButton && (
          <FixedButtonContainer>
            <div>
              <Typography variant={TypographyVariant.Body2}>
                {i18n.t('vote.you_need_authenticate_to_vote')}
              </Typography>
            </div>
          </FixedButtonContainer>
        )}

        <If condition={showInlineQuestions && !hasVoted}>
          <Then>
            <QuestionsListInline
              onComponentMounted={handleVideoPosition}
              ref={votingVideoContainerRef}
              results={choices}
              questions={processInfo?.metadata?.questions}
              voteWeight={voteWeight}
              onSelect={votingMethods.onSelect}
              onFinishVote={handleFinishVote}
            />
          </Then>
        </If>

        {hasVoted && (
          <VoteRegisteredLgContainer>
            <VoteRegisteredCard explorerLink={explorerLink} />
          </VoteRegisteredLgContainer>
        )}

        <If condition={hasVoted && !showResults}>
          <Then>
            <VoteRegisteredLgContainer>
              <Typography align={TextAlign.Center} variant={TypographyVariant.Body3}>{i18n.t('vote.you_vote_has_been_submit_successfully_the_results_will_be_available')}</Typography>
            </VoteRegisteredLgContainer>
          </Then>
        </If>

        {showResults &&
          processInfo?.metadata?.questions.map(
            (question: Question, index: number) => (
              <VoteQuestionCard
                questionIdx={index}
                key={index}
                question={question}
                hasVoted={hasVoted}
                totalVotes={totalVotes}
                result={results?.questions[index]}
                processStatus={processInfo?.state?.status}
                selectedChoice={choices.length > index ? choices[index] : -1}
                readOnly={true}
                onSelectChoice={(selectedChoice) => {
                  votingMethods.onSelect(index, selectedChoice)
                }}
              />
            )
          )
        }

        <If condition={showDescription && totalVotes > 0 && !showInlineQuestions}>
          <Then>
            <Grid>
              <Card sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {processVotingType === VotingType.Weighted
                    ? i18n.t('vote.total_weighted_votes', {
                      totalVotes: results?.totalVotes,
                      totalWeightedVotes: results?.totalWeightedVotes,
                    })
                    : i18n.t('vote.total_votes', {
                      totalVotes: results?.totalVotes,
                    })}
                </TextContainer>
              </Card>
            </Grid>
          </Then>
        </If>
      </VotingCard>

      <ConfirmModal
        isOpen={confirmModalOpened}
        onVoted={handleOnVoted}
        onClose={handleBackToVoting}
      />
    </>
  )
}

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
  z-index: 30;
  transition: all 0.4s ease-in-out;
  top: ${({ top }) => top || 0}px;
  height: ${({ height }) => height || 300}px;
  width: ${({ width }) => width + 'px' || '100%'};
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  max-width: 800px;
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

const VoteNowCardContainer = styled.div`
  position: sticky;
  top: 20px;
`

const SubmitButtonContainer = styled(FlexContainer)`
  margin: 30px 0 20px;
`
const TextContainer = styled(Body1)`
  margin: 12px 0;
`
