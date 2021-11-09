import React, {
  useState,
  ReactNode,
  useEffect,
  useMemo,
  useRef,
  forwardRef,
} from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import ReactPlayer from 'react-player'

import {
  useEntity,
  useBlockHeight,
  useBlockStatus,
  useProcess,
} from '@vocdoni/react-hooks'

import { Question } from '@lib/types'

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
import { VoteRegisteredCard } from './components/vote-registered-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { Else, If, Then, When } from 'react-if'
import { useUrlHash } from 'use-url-hash'
import { VotingApi, EntityMetadata, Voting } from 'dvote-js'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { Body1, TextAlign } from '@components/elements/typography'
import { QuestionsList } from './components/questions-list'
import { VoteNowCard } from './components/vote-now-card'

enum VotingState {
  NotStarted = 'notStarted',
  Started = 'started',
  Ended = 'ended',
  Guest = 'guest',
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

  const { methods, choices, allQuestionsChosen, hasVoted, results, nullifier } =
    useVoting(processId)
  const { process: processInfo, error, loading } = useProcess(processId)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const [votingState, setVotingState] = useState<VotingState>(
    VotingState.NotStarted
  )

  const totalVotes = results?.totalVotes || 0
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
    if (!wallet) {
      return setVotingState(VotingState.Guest)
    }

    if (hasVoted) {
      return setVotingState(VotingState.Ended)
    }
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
        customLogo: entityMetadata?.media?.logo
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
    if (voteStatus == VoteStatus.Active) {
      setVotingState(VotingState.Started)
    }
  }

  const handleFinishVote = () => {
    setConfirmModalOpened(true)
  }

  const handleBackToDescription = () => {
    setVotingState(VotingState.NotStarted)
  }

  const handleBackToVoting = () => {
    setVotingState(VotingState.Started)
    setConfirmModalOpened(false)
  }

  const handleOnVoted = () => {
    setVotingState(VotingState.Ended)
    setConfirmModalOpened(false)
  }

  const showDescription =
    votingState === VotingState.NotStarted ||
    votingState === VotingState.Ended ||
    votingState === VotingState.Guest

  const showResults =
    votingState === VotingState.Guest || votingState === VotingState.Ended

  const showVotingButton = votingState == VotingState.NotStarted

  return (
    <>
      <PageCard>
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

              <Column sm={12} md={3} hiddenSm>
                <VoteNowCardContainer>
                  <VoteNowCard
                    onVote={handleVoteNow}
                    explorerLink={explorerLink}
                    disabled={voteStatus !== VoteStatus.Active}
                    hasVoted={showResults}
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
            onSelect={methods.onSelect}
            onFinishVote={handleFinishVote}
            onBackDescription={handleBackToDescription}
          />
        )}
        <Grid>
          <If condition={votingState === VotingState.Guest}>
            <Then>
              <Card sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {i18n.t('vote.you_are_connected_as_a_guest')}
                </TextContainer>
              </Card>
            </Then>
          </If>
        </Grid>

        {showVotingButton && (
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

        {hasVoted && <VoteRegisteredCard explorerLink={explorerLink} />}
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
                  methods.onSelect(index, selectedChoice)
                }}
              />
            )
          )}

        <If condition={showDescription && totalVotes > 0}>
          <Then>
            <Grid>
              <Card sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {i18n.t('vote.total_votes')}: {totalVotes}
                </TextContainer>
              </Card>
            </Grid>
          </Then>
        </If>
      </PageCard>

      <ConfirmModal
        isOpen={confirmModalOpened}
        onVoted={handleOnVoted}
        onClose={handleBackToVoting}
      />
    </>
  )
}

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
  padding: 10px;
  box-shadow: 1px 1px 9px #8f8f8f;

  & > div {
    margin: 0 auto;
    max-width: 300px;
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
