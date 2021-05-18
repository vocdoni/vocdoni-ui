import React from 'react'
import i18n from '@i18n'
import styled from 'styled-components'
import { DigestedProcessResultItem, ProcessStatus } from 'dvote-js'
import { colors } from 'theme/colors'
import { ViewContext, ViewStrategy } from '@lib/strategy'
import { Question } from '@lib/types'
import { Card } from '@components/cards'
import { SectionText, SectionTitle, TextSize } from '@components/text'
import { Column, Grid } from '@components/grid'
import {
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/flex'

import { QuestionResults } from './question-results'
import { ChoiceSelector } from './choice-selector'
import { ChoiceList } from './choice-list'

interface IVoteQuestionCardProps {
  question: Question
  questionIdx: number
  readOnly?: boolean
  hasVoted: boolean
  totalVotes: number
  processStatus: ProcessStatus
  result?: DigestedProcessResultItem
  selectedChoice?: number
  onSelectChoice?: (choiceValue: number) => void
}

export const VoteQuestionCard = ({
  question,
  questionIdx,
  hasVoted,
  totalVotes,
  processStatus,
  result,
  selectedChoice,
  readOnly,
  onSelectChoice,
}: IVoteQuestionCardProps) => {

  const questionsView = new ViewStrategy(
    () => (!hasVoted && !readOnly) && processStatus.value === ProcessStatus.READY,
    (
      <ChoiceSelector
        questionIdx={questionIdx}
        question={question}
        selectedChoice={selectedChoice}
        onSelectChoice={onSelectChoice}
      />
    )
  )

  const showResults =
    processStatus.value === ProcessStatus.ENDED ||
    processStatus.value === ProcessStatus.RESULTS ||
    hasVoted

  const resultsQuestionView = new ViewStrategy(
    () => (showResults || readOnly) && !!result && !!result.voteResults,
    (
      <QuestionResults
        question={question}
        result={result}
        totalVotes={totalVotes}
      />
    )
  )

  const noResultsAvailableView = new ViewStrategy(
    () => showResults && !result,
    (
      <SectionText>
        {i18n.t('vote_question_card.no_results_available')}
      </SectionText>
    )
  )

  const questionListView = new ViewStrategy(
    () => true,
    <ChoiceList question={question} />
  )

  const choiceContextView = new ViewContext([
    questionsView,
    resultsQuestionView,
    noResultsAvailableView,
    questionListView,
  ])

  return (
    <Grid>
      <Card>
        <QuestionContainer>
          <Grid>
            <Column md={8} sm={12}>
              <SectionText>
                {i18n.t('vote_question_card.question', { number: questionIdx + 1 })}
              </SectionText>

              <SectionText size={TextSize.Big}>
                {question.title.default}
              </SectionText>

              <DescriptionText color={colors.lightText}>
                {question.description.default}
              </DescriptionText>
            </Column>

            <Column md={4} sm={12}>
              <FlexContainer
                height="100%"
                direction={FlexDirection.Column}
                justify={FlexJustifyContent.Center}
              >
                {choiceContextView.getView()}
              </FlexContainer>
            </Column>
          </Grid>
        </QuestionContainer>
      </Card>
    </Grid>
  )
}

const DescriptionText = styled(SectionText)`
  white-space: pre-wrap;
`

const QuestionContainer = styled.div`
  padding: 12px 20px;

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 6px 8px;
  }
`

const QuestionTitle = styled(SectionTitle)`
  font-size: 33px;
  margin-bottom: 10px;
`
