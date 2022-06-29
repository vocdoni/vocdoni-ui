import React from 'react'
import styled from 'styled-components'
import { Column, Grid } from '@components/elements/grid'
import { Typography, TypographyVariant } from '@components/elements/typography'
import { Choice, Question } from '@lib/types'
import { Radio } from '@components/elements/radio'
import { CardDiv } from '@components/elements/cards'

interface IQuestionProps {
  question: Question
  questionIndex: number
  onSelectChoice: (choiceIndex: number) => void
  selectedIndex: number,
  isDisabled?: boolean
}

export const QuestionCard = ({
  question,
  questionIndex,
  onSelectChoice,
  selectedIndex,
  isDisabled
}: IQuestionProps) => {
  return (
    <QuestionCardContainer>
      <Typography variant={TypographyVariant.H4} margin="0">
        {question.title.default}
      </Typography>
      {question.description && (
        <Typography variant={TypographyVariant.Small}>
          {question.description.default}
        </Typography>
      )}

      <OptionsContainer>
        {question.choices.map((option: Choice, index) => (
          <Radio
            name={`question-${questionIndex}`}
            key={index}
            // value={option.value.toString()}
            checked={option.value === selectedIndex}
            onClick={() => onSelectChoice(option.value)}
            disabled={isDisabled}
          >
            {option.title.default}
          </Radio>
        ))}
      </OptionsContainer>
    </QuestionCardContainer>
  )
}

const QuestionCardContainer = styled(CardDiv)`
  padding: 20px 0px;
  box-shadow: none;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 12px 0px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 16x;
  }
`

const OptionsContainer = styled.div``
