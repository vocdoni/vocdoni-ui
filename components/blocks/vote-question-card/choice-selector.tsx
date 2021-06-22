import React from 'react'
import styled from 'styled-components'

import { Radio } from '@components/elements/radio'

import { Choice, Question } from '@lib/types'

interface IChoiceSelectorProps {
  questionIdx: number
  question: Question
  selectedChoice?: number
  onSelectChoice?: (choiceValue: number) => void
}

export const ChoiceSelector = ({
  questionIdx,
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
            name={String(questionIdx)+'_'+String(index)}
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
