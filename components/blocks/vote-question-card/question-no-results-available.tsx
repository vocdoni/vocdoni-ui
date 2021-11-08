import React from 'react'
import styled from 'styled-components'
import { CircularProgressbar } from 'react-circular-progressbar'

import { Choice, Question } from '@lib/types'

import { FlexContainer } from '@components/elements/flex'
import { SectionText } from '@components/elements/text'


interface IQuestionResultsProps {
  question: Question
}
export const QuestionNoResultsAvailable = ({question}: IQuestionResultsProps) => {
  return (
    <>
      {question.choices.map((choice: Choice, index: number) => (
        <FlexContainer key={index}>
          <ProgressBarContainer>
            <CircularProgressbar
              value={0}
            />
          </ProgressBarContainer>
          <div>
            <DescriptionContainer>{choice.title.default}</DescriptionContainer>
          </div>
        </FlexContainer>
      ))}
    </>
  )
}

const ProgressBarContainer = styled.div`
  width: 60px;
  min-width: 60px;
  margin-right: 12px;

  & > svg > text {
    font-size: 24px !important;
  }
`

const DescriptionContainer = styled(SectionText)`
  font-size: 24px;
`
