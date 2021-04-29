import React, { useState } from 'react'
import styled from 'styled-components'

import i18n from '@i18n'

import { Question } from '@lib/types'
import { useVoting } from '@hooks/use-voting'

import { Column, Grid } from '@components/grid'
import { PageCard } from '@components/cards'
import { Button } from '@components/button'
import { FlexContainer, FlexJustifyContent } from '@components/flex'
import { VotePageHeader } from '@components/pub/votes/common/vote-page-header'
import { VoteDescription } from '@components/pub/votes/main/vote-description'
import { MetadataFields } from '@components/steps-new-vote/metadata'
import { VoteNowCard } from '@components/pub/votes/main/vote-now-card'
import { VoteQuestionCard } from '@components/pub/votes/main/vote-question-card'
import { ConfirmModal } from '@components/pub/votes/main/confirm-modal'

const VotingPage = () => {
  const { methods, choices, allQuestionsChosen, processInfo } = useVoting()

  const [confirmModalOpened, setConfirmModalOpened] = useState<boolean>(false)
  // Mocked data
  const processTitle = 'General Assembly 2021'
  const entityName = 'Sixseven Company'

  // end mocked data
  return (
    <>
      <PageCard>
        <VotePageHeader processTitle={processTitle} entityName={entityName} />

        <Grid>
          <Column lg={9} sm={12}>
            <VoteDescription
              description={processInfo.metadata.description.default}
              liveSteam={processInfo.metadata.media.streamUri}
              forumUrl={processInfo.metadata.meta[MetadataFields.DiscussionLink]}
              documentUrl={processInfo.metadata.meta[MetadataFields.AttachmentLink]}
              voteStatus={1}
            />
          </Column>

          <Column lg={3} sm={12}>
            <VoteNowCard />
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
            disabled={allQuestionsChosen}
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

export default VotingPage
