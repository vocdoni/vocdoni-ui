import React from 'react'
import styled from 'styled-components'

import { Radio } from '@components/radio'

import { Choice, Question } from '@lib/types'

interface IChoiceSelectorProps {
  question: Question
  selectedChoice?: number
  onSelectChoice?: (choiceValue: number) => void
}

export const ChoiceSelector = ({
  question,
  selectedChoice,
  onSelectChoice,
}: IChoiceSelectorProps) => {
  return (
    <>
      {question.choices.map((choice: Choice, index: number) => (
        <OptionContainer key={index}>
          <Radio
            onClick={() => onSelectChoice && onSelectChoice(choice.value)}
            checked={choice.value === selectedChoice}
            name={choice.title.default}
          >
            {choice.title.default}
          </Radio>
        </OptionContainer>
      ))}
    </>
  )
}

const OptionContainer = styled.div`
  margin: 10px 0;
`
