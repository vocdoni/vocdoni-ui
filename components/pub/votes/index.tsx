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

export const VotingPageView = () => {
  const { methods, choices, allQuestionsChosen, processInfo } = useVoting()

  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  // Mocked data
  const entityName = 'Sixseven Company'
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
              voteStatus={1}
            />
          </Column>

          <Column lg={3} sm={12}>
            <VoteNowCard
              disabled={!allQuestionsChosen}
              onVote={() => setConfirmModalOpened(true)}
            />
          </Column>
        </Grid>

        <Grid>
          {processInfo.metadata.questions.map(
            (question: Question, index: number) => (
              <Column key={index}>
                <VoteQuestionCard
                  question={question}
                  index={index}
                  selectedChoice={choices ? choices[index] : 0}
                  onSelectChoice={(selectedChoice) => {
                    methods.onSelect(index, selectedChoice)
                  }}
                />
              </Column>
            )
          )}
        </Grid>

        <SubmitButtonContainer justify={FlexJustifyContent.Center}>
          <Button
            positive
            disabled={!allQuestionsChosen}
            onClick={() => setConfirmModalOpened(true)}
          >
            {i18n.t('vote.submit_my_vote')}
          </Button>
        </SubmitButtonContainer>
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
