import React, { useState, useContext , useEffect} from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
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
import { Card, PageCard } from '@components/elements/cards'
import { Button } from '@components/elements/button'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { VoteQuestionCard } from '@components/blocks/vote-question-card'
import { MetadataFields } from '@components/pages/votes/new/metadata'

import { CardImageHeader } from '@components/blocks/card/image-header'
import { VoteDescription } from '@components/blocks/vote-description'

import { ConfirmModal } from './components/confirm-modal'
import { VoteRegisteredCard } from './components/vote-registered-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { Else, If, Then, When } from 'react-if'
import { useUrlHash } from 'use-url-hash'
import { VotingApi, EntityMetadata } from 'dvote-js'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'
import { Body1, TextAlign } from '@components/elements/typography'

export const VotingPageView = () => {
  const { i18n } = useTranslation()
  const processId = useUrlHash().slice(1) // Skip "/"
  const { updateAppTheme } = useTheme();

  const { methods, choices, allQuestionsChosen, hasVoted, results, nullifier } =
    useVoting(processId)
  const { process: processInfo, error, loading } = useProcess(processId)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.state?.entityId)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  // const votePageLink = `${VOTING_PATH}/${processInfo?.id?}`

  const readOnly = !wallet?.address
  const totalVotes = results?.totalVotes || 0
  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus?.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(
    processInfo?.state,
    blockHeight
  )
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier
  const entityMetadata = metadata as EntityMetadata

  useEffect(() => {
    if (processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]) {
      const brandColor = processInfo?.metadata?.meta?.[MetadataFields.BrandColor] || entityMetadata?.meta?.[MetadataFields.BrandColor]

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

  return (
    <>
      <PageCard>
        <CardImageHeader
          title={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          subtitle={metadata?.name.default}
          entityImage={metadata?.media.avatar}
        />

        <Grid>
          <Column sm={12}>
            <VoteDescription
              description={processInfo?.metadata?.description.default}
              liveStream={processInfo?.metadata?.media.streamUri}
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

          <If condition={readOnly}>
            <Then>
              <Card sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {i18n.t('vote.you_are_connected_as_a_guest')}
                </TextContainer>
              </Card>
            </Then>
          </If>
        </Grid>

        {hasVoted && <VoteRegisteredCard explorerLink={explorerLink} />}

        {processInfo?.metadata?.questions.map(
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
              readOnly={readOnly}
              onSelectChoice={(selectedChoice) => {
                methods.onSelect(index, selectedChoice)
              }}
            />
          )
        )}

        <If condition={totalVotes > 0}>
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

        <When condition={!hasVoted && !readOnly}>
          <SubmitButtonContainer justify={FlexJustifyContent.Center}>
            <Button
              positive
              // color={processInfo?.metadata?.meta[MetadataFields.PrimaryColor]}
              disabled={!allQuestionsChosen || voteStatus != VoteStatus.Active}
              onClick={() => setConfirmModalOpened(true)}
            >
              {i18n.t('vote.submit_my_vote')}
            </Button>
          </SubmitButtonContainer>
        </When>
      </PageCard>

      <ConfirmModal
        isOpen={confirmModalOpened}
        onClose={() => setConfirmModalOpened(false)}
      />
    </>
  )
}

const SubmitButtonContainer = styled(FlexContainer)`
  margin: 30px 0 20px;
`
const TextContainer = styled(Body1)`
  margin: 12px 0;
`
