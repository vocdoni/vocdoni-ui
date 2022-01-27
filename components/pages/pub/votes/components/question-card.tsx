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
  selectedIndex: number
  randomAnswersOrder: boolean
}

let shuffle = []
let isShuffled = []

export const QuestionCard = ({
  question,
  questionIndex,
  onSelectChoice,
  selectedIndex,
  randomAnswersOrder,
}: IQuestionProps) => {

  function shuffleArray(array) {
    let currentIndex = array.length,  randomIndex;

    // While there remain elements to shuffle...
    while (currentIndex != 0) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex--;

      // And swap it with the current element.
      [array[currentIndex], array[randomIndex]] = [
        array[randomIndex], array[currentIndex]];
    }

    return array;
  }
    
  if (randomAnswersOrder && typeof isShuffled[questionIndex] === 'undefined' && isShuffled[questionIndex] !== true) {
    shuffle[questionIndex] = [...question.choices]
    shuffleArray(shuffle[questionIndex])
    isShuffled[questionIndex] = true
  }

  return (
    <QuestionCardContainer border>
      <Typography variant={TypographyVariant.H4} margin="0">
        {question.title.default}
      </Typography>
      {question.description && (
        <Typography variant={TypographyVariant.Small}>
          {question.description.default}
        </Typography>
      )}

      <OptionsContainer>
        { randomAnswersOrder && shuffle[questionIndex].map((option: Choice, index) => (
              <Radio
                name={`question-${questionIndex}`}
                key={index}
                // value={option.value.toString()}
                checked={option.value === selectedIndex}
                onClick={() => onSelectChoice(question.choices[question.choices.map((item) => item.value).indexOf(option.value)].value)}
              >
                {option.title.default}
              </Radio>
        ))}

        { !randomAnswersOrder && question.choices.map((option: Choice, index) => (
            <Radio
              name={`question-${questionIndex}`}
              key={index}
              // value={option.value.toString()}
              checked={option.value === selectedIndex}
              onClick={() => onSelectChoice(option.value)}
            >
              {option.title.default}
            </Radio>          
        ))}

      </OptionsContainer>
    </QuestionCardContainer>
  )
}

const QuestionCardContainer = styled(CardDiv)`
  padding: 64px;
  

  @media ${({ theme }) => theme.screenMax.tabletL} {
    padding: 32px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    padding: 16x;
  }
`

const OptionsContainer = styled.div``
