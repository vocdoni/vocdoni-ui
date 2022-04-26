import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'react-i18next'
import { CircularProgressbar } from 'react-circular-progressbar'
import { SingleChoiceQuestionResults } from 'dvote-js'

import { colors } from 'theme/colors'

import { Choice, Question } from '@lib/types'

import { FlexAlignItem, FlexContainer } from '@components/elements/flex'
import { SectionText } from '@components/elements/text'

interface IQuestionResultsProps {
  question: Question
  result: SingleChoiceQuestionResults
  totalVotes: number
}
export const QuestionResults = ({
  question,
  result,
  totalVotes,
}: IQuestionResultsProps) => {
  const { i18n } = useTranslation()

  const getOptionResult = (index: number): number =>
    result?.voteResults[index].votes.toNumber()

  const getOptionPercentage = (index: number): number =>
    totalVotes ? (getOptionResult(index) / totalVotes) * 100 : 0

  return (
    <>
      {question.choices.map((choice: Choice, index: number) => (
        <FlexContainer key={index} alignItem={FlexAlignItem.Center}>
          <ProgressBarContainer>
            <CircularProgressbar
              styles={buildGraphStyle(getOptionPercentage(index))}
              value={getOptionPercentage(index)}
              text={`${getOptionPercentage(index).toFixed(1)}%`}
            />
          </ProgressBarContainer>

          <ResultsContainer>
            <DescriptionContainer>{choice.title.default}</DescriptionContainer>
            <SectionText color={colors.lightText}>
              {i18n.t('vote_question_card.number_votes', {
                number: getOptionResult(index),
              })}
            </SectionText>
          </ResultsContainer>
        </FlexContainer>
      ))}
    </>
  )
}

const buildGraphStyle = (percent: number) => {
  const mainColor = percent < 50 ? '#FC8B23' : colors.accent1
  return {
    text: {
      fill: mainColor,
      fontSize: '26px',
    },
    path: {
      stroke: mainColor,
    },
  }
}

const ResultsContainer = styled.div`
  p {
    margin-bottom: 2px;
  }
`

const ProgressBarContainer = styled.div`
  width: 60px;
  min-width: 60px;
  margin-right: 12px;
  margin-bottom: 4px;

  & > svg > text {
    font-size: 24px !important;
  }
`

const DescriptionContainer = styled(SectionText)`
  font-size: 18px;
  @media ${({ theme }) => theme.screenMax.mobileL} {
    font-size: 14px;
  }
`
