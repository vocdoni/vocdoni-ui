import React, { useState } from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { Question } from '@lib/types'
import { useVoting } from '@hooks/use-voting'

import { Column, Grid } from '@components/grid'
import { PageCard } from '@components/cards'
import { Button } from '@components/button'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { MetadataFields } from '@components/steps-new-vote/metadata'

import { VotePageHeader } from './common/vote-page-header'

import { VoteNowCard } from './components/vote-now-card'
import { VoteQuestionCard } from './components/vote-question-card'
import { ConfirmModal } from './components/confirm-modal'
import { VoteDescription } from './components/vote-description'
import { VoteRegisteredCard } from './components/vote-registered-card'
import { VOTING_PATH } from '@const/routes'

export const VotingPageView = () => {
  const {
    methods,
    choices,
    allQuestionsChosen,
    processInfo,
    hasVoted,
    results,
  } = useVoting()

  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  const votePageLink = `${VOTING_PATH}/${processInfo.id}`


  // Mocked data
  const entityName = 'Sixseven Company'
  const totalVotes = results.totalVotes || 0

  // end mocked data

  return (
    <>
      <PageCard>
        <VotePageHeader
          processTitle={processInfo.metadata.title.default}
          entityName={entityName}
        />

        <Grid>
          <Column lg={9} sm={12}>
            <VoteDescription
              description={processInfo.metadata.description.default}
              liveSteam={processInfo.metadata.media.streamUri}
              discussionUrl={
                processInfo.metadata.meta[MetadataFields.DiscussionLink]
              }
              attachmentUrl={
                processInfo.metadata.meta[MetadataFields.AttachmentLink]
              }
              voteStatus={processInfo.parameters.status}
            />
          </Column>

          <Column lg={3} sm={12}>
            <VoteNowCard
              hasVoted={hasVoted}
              voteLink={votePageLink}
              disabled={!allQuestionsChosen}
              onVote={() => setConfirmModalOpened(true)}
            />
          </Column>
        </Grid>

        {hasVoted && <VoteRegisteredCard voteLink={votePageLink} />}

        <Grid>
          {processInfo.metadata.questions.map(
            (question: Question, index: number) => (
                <VoteQuestionCard
                  key={index}
                  question={question}
                  index={index}
                  hasVoted={hasVoted}
                  totalVotes={totalVotes}
                  result={results.questions[index]}
                  selectedChoice={choices ? choices[index] : 0}
                  onSelectChoice={(selectedChoice) => {
                    methods.onSelect(index, selectedChoice)
                  }}
                />
            )
          )}
        </Grid>

        {!hasVoted && (
          <SubmitButtonContainer justify={FlexJustifyContent.Center}>
            <Button
              positive
              disabled={!allQuestionsChosen}
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
