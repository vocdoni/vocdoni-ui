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
  index: number
  hasVoted: boolean
  totalVotes: number
  processStatus: ProcessStatus
  result?: DigestedProcessResultItem
  selectedChoice?: number
  onSelectChoice?: (choiceValue: number) => void
}

export const VoteQuestionCard = ({
  question,
  index,
  hasVoted,
  totalVotes,
  processStatus,
  result,
  selectedChoice,
  onSelectChoice,
}: IVoteQuestionCardProps) => {

  const showResults  = processStatus.value === ProcessStatus.ENDED || processStatus.value === ProcessStatus.RESULTS || hasVoted

  const resultsQuestionView = new ViewStrategy(
    () =>  showResults && !!result && !!result.voteResults,
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
    <SectionText>{i18n.t('vote_question_card.no_available_results')}</SectionText>
  )

  const questionsView = new ViewStrategy(
    () => !hasVoted && processStatus.value === ProcessStatus.READY,
    (
      <ChoiceSelector
        question={question}
        selectedChoice={selectedChoice}
        onSelectChoice={onSelectChoice}
      />
    )
  )

  const questionListView = new ViewStrategy(
    () => true,
    (
      <ChoiceList question={question}/>
    )
  )

  const choiceContextView = new ViewContext([
    questionsView,
    resultsQuestionView,
    noResultsAvailableView,
    questionListView
  ])

  return (
    <Grid>
      <Card>
        <QuestionContainer>
          <Grid>
            <Column md={8} sm={12}>
              <SectionText>
                {i18n.t('vote_question_card.question', { number: index + 1 })}
              </SectionText>

              <SectionText size={TextSize.Big}>{question.title.default}</SectionText>

              <SectionText color={colors.lightText}>
                {question.description.default}
              </SectionText>
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

const QuestionContainer = styled.div`
  padding: 12px 20px;
`

const QuestionTitle = styled(SectionTitle)`
  font-size: 33px;
  margin-bottom: 10px;
`
