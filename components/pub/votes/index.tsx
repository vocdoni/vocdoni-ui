import React, { useState } from 'react'
import styled from 'styled-components'
import { useEntity, useBlockHeight, useBlockStatus, useProcess } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { Question } from '@lib/types'
import { useVoting } from '@hooks/use-voting'
import { useWallet, WalletRoles } from '@hooks/use-wallet'

import { VOTING_PATH } from '@const/routes'

import { Column, Grid } from '@components/grid'
import { Card, PageCard } from '@components/cards'
import { Button } from '@components/button'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { MetadataFields } from '@components/steps-new-vote/metadata'
import { VoteQuestionCard } from '@components/common/vote-question-card'

import { VotePageHeader } from '@components/common/vote-page-header'
import { VoteDescription } from '@components/common/vote-description'

import { VoteNowCard } from './components/vote-now-card'
import { ConfirmModal } from './components/confirm-modal'
import { VoteRegisteredCard } from './components/vote-registered-card'
import { VoteStatus, getVoteStatus } from '@lib/util'
import { Else, If, Then, When } from 'react-if'
import { SectionText, TextAlign } from '@components/text'
import { useUrlHash } from 'use-url-hash'
import { VotingApi } from 'dvote-js'
import { DateDiffType, localizedStrDateDiff } from '@lib/date'

export const VotingPageView = () => {
  const processId = useUrlHash().slice(1) // Skip "/"
  const {
    methods,
    choices,
    allQuestionsChosen,
    hasVoted,
    results,
    nullifier,
  } = useVoting(processId)
  const { process: processInfo, error, loading } = useProcess(processId)
  const { wallet } = useWallet({ role: WalletRoles.VOTER })
  const { metadata } = useEntity(processInfo?.entity)
  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  // const votePageLink = `${VOTING_PATH}/${processInfo?.id?}`

  const readOnly = !wallet?.address
  const totalVotes = results?.totalVotes || 0
  const { blockStatus } = useBlockStatus()
  const blockHeight = blockStatus.blockNumber
  const voteStatus: VoteStatus = getVoteStatus(processInfo, blockHeight)
  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier

  let dateDiffStr = ""
  if (processInfo?.parameters?.startBlock && (voteStatus == VoteStatus.Active || voteStatus == VoteStatus.Paused)) {
    if (processInfo?.parameters?.startBlock > blockHeight) {
      const date = VotingApi.estimateDateAtBlockSync(processInfo?.parameters?.startBlock, blockStatus)
      dateDiffStr = localizedStrDateDiff(DateDiffType.Start, date)
    }
    else { // starting in the past
      const date = VotingApi.estimateDateAtBlockSync(processInfo?.parameters?.startBlock + processInfo?.parameters?.blockCount, blockStatus)
      dateDiffStr = localizedStrDateDiff(DateDiffType.End, date)
    }
  }

  return (
    <>
      <PageCard>
        <VotePageHeader
          processTitle={processInfo?.metadata?.title.default}
          processImage={processInfo?.metadata?.media.header}
          entityName={metadata?.name.default}
          entityImage={metadata?.media.avatar}
        />

        <Grid>
          <Column lg={9} sm={12}>
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

          <If condition={!readOnly}>
            <Then>
              <Column lg={3} sm={12}>
                <VoteNowCard
                  hasVoted={hasVoted}
                  explorerLink={explorerLink}
                  disabled={!allQuestionsChosen || voteStatus != VoteStatus.Active}
                  onVote={() => setConfirmModalOpened(true)}
                />
              </Column>
            </Then>
            <Else>
              <Card lg={3} sm={12}>
                <TextContainer align={TextAlign.Center}>
                  {i18n.t('vote.you_are_connected_as_a_guest')}
                </TextContainer>
              </Card>
            </Else>
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
              processStatus={processInfo?.parameters.status}
              selectedChoice={(choices.length > index) ? choices[index] : -1}
              readOnly={readOnly}
              onSelectChoice={(selectedChoice) => {
                methods.onSelect(index, selectedChoice)
              }}
            />
          )
        )}

        <When condition={!hasVoted && !readOnly}>
          <SubmitButtonContainer justify={FlexJustifyContent.Center}>
            <Button
              positive
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
const TextContainer = styled(SectionText)`
  margin: 12px 0;
  font-size: 16px;
`
