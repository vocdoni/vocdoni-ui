import React from 'react'
import styled from 'styled-components'
import {
  SingleChoiceQuestionResults,
  VochainProcessStatus,
  VochainProcessStatus as ProcessStatus,
} from 'dvote-js'
import { useTranslation } from 'react-i18next'

import { colors } from 'theme/colors'
import { ViewContext, ViewStrategy } from '@lib/strategy'
import { Question } from '@lib/types'
import { Card } from '@components/elements/cards'
import { SectionText, SectionTitle, TextSize } from '@components/elements/text'
import { Column, Grid } from '@components/elements/grid'
import {
  FlexContainer,
  FlexDirection,
  FlexJustifyContent,
} from '@components/elements/flex'

import { QuestionResults } from './question-results'
import { QuestionNoResultsAvailable } from './question-no-results-available'
import { ChoiceSelector } from './choice-selector'

interface IVoteQuestionCardProps {
  question: Question
  questionIdx: number
  readOnly?: boolean
  hasVoted: boolean
  totalVotes: number
  processStatus: VochainProcessStatus
  result?: SingleChoiceQuestionResults
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
  const { i18n } = useTranslation()

  const questionsView = new ViewStrategy(
    () => !hasVoted && !readOnly && processStatus === ProcessStatus.READY,
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
    processStatus === ProcessStatus.ENDED ||
    processStatus === ProcessStatus.RESULTS ||
    hasVoted

  const resultsQuestionView = new ViewStrategy(
    () =>
      (showResults || readOnly) &&
      !!result &&
      typeof totalVotes !== 'undefined',
    (
      <QuestionResults
        question={question}
        result={result}
        totalVotes={totalVotes}
      />
    )
  )

  const noResultsAvailableView = new ViewStrategy(
    () => true,
    (
      <>
        <QuestionNoResultsAvailable question={question} />
        <NoResultsAvailableText>
          {i18n.t('vote_question_card.no_results_available')}
        </NoResultsAvailableText>
      </>
    )
  )

  const choiceContextView = new ViewContext([
    questionsView,
    resultsQuestionView,
    noResultsAvailableView,
  ])

  return (
    <Grid>
      <Card>
        <QuestionContainer>
          <Grid>
            <Column md={8} sm={12}>
              <SectionText>
                {i18n.t('vote_question_card.question', {
                  number: questionIdx + 1,
                })}
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

const NoResultsAvailableText = styled(SectionText)`
  padding-top: 12px;
`
