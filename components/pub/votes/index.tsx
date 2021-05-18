import React, { useState } from 'react'
import styled from 'styled-components'
import { useEntity, useBlockHeight } from '@vocdoni/react-hooks'

import i18n from '@i18n'

import { Question } from '@lib/types'
import { useVoting } from '@hooks/use-voting'

import { VOTING_PATH } from '@const/routes'

import { Column, Grid } from '@components/grid'
import { PageCard } from '@components/cards'
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

export const VotingPageView = () => {
  const {
    methods,
    choices,
    allQuestionsChosen,
    processInfo,
    hasVoted,
    results,
    nullifier,
  } = useVoting()
  const { metadata } = useEntity(processInfo?.entity)

  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const votePageLink = `${VOTING_PATH}/${processInfo.id}`

  const totalVotes = results?.totalVotes || 0

  const { blockHeight } = useBlockHeight()

  const voteStatus: VoteStatus = getVoteStatus(processInfo.parameters.status, processInfo.parameters.startBlock, blockHeight)

  const explorerLink = process.env.EXPLORER_URL + '/envelope/' + nullifier

  return (
    <>
      <PageCard>
        <VotePageHeader
          processTitle={processInfo.metadata.title.default}
          processImage={processInfo?.metadata?.media.header}
          entityName={metadata?.name.default}
          entityImage={metadata?.media.avatar}
        />

        <Grid>
          <Column lg={9} sm={12}>
            <VoteDescription
              description={processInfo.metadata.description.default}
              liveStream={processInfo.metadata.media.streamUri}
              discussionUrl={
                processInfo.metadata.meta[MetadataFields.DiscussionLink]
              }
              attachmentUrl={
                processInfo.metadata.meta[MetadataFields.AttachmentLink]
              }
              voteStatus={voteStatus}
            />
          </Column>

          <Column lg={3} sm={12}>
            <VoteNowCard
              hasVoted={hasVoted}
              explorerLink={explorerLink}
              disabled={!allQuestionsChosen || voteStatus != VoteStatus.Active}
              onVote={() => setConfirmModalOpened(true)}
            />
          </Column>
        </Grid>

        {hasVoted && <VoteRegisteredCard explorerLink={explorerLink} />}

        {processInfo.metadata.questions.map(
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
              onSelectChoice={(selectedChoice) => {
                methods.onSelect(index, selectedChoice)
              }}
            />
          )
        )}

        {!hasVoted && (
          <SubmitButtonContainer justify={FlexJustifyContent.Center}>
            <Button
              positive
              disabled={!allQuestionsChosen || voteStatus != VoteStatus.Active}
              onClick={() => setConfirmModalOpened(true)}
            >
              {i18n.t('vote.submit_my_vote')}
            </Button>
          </SubmitButtonContainer>
        )}
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
