import React, { forwardRef, RefObject, useState } from 'react'
import { Choice, Question } from '@lib/types'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/elements/button'
import styled from 'styled-components'

import { Typography, TypographyVariant } from '@components/elements/typography'
import ReactPlayer from 'react-player'
import { Column } from '@components/elements/grid'
import { QuestionCard } from './question-card'
import { colors } from '@theme/colors'
import { Indexed } from '@ethersproject/abi'

interface IQuesListProps {
  hasVideo: boolean
  questions: Question[]
  results: number[]
  onSelect: (questionIndex: number, value: number) => void
  onFinishVote: (results: number[]) => void
  onBackDescription: () => void
}

export const QuestionsList = forwardRef<HTMLDivElement, IQuesListProps>(
  (
    { hasVideo, questions, results, onSelect, onFinishVote, onBackDescription }: IQuesListProps,
    ref
  ) => {
    const [questionIndex, setQuestionIndex] = useState(0)
    // const [results, setResults] = useState<number[]>([])
    const { i18n } = useTranslation()
    const lastQuestion = questionIndex === questions?.length - 1

    const handleNext = () => {
      if (questionIndex + 1 < questions.length) {
        setQuestionIndex(questionIndex + 1)
        return
      }

      onFinishVote(results)
    }

    const handlePrev = () => {
      if (questionIndex !== 0) {
        setQuestionIndex(questionIndex - 1)
        return
      }

      onBackDescription()
    }

    const handleChoice = (questionNumber: number, choice: number) => {
      // const updatedChoices = [...results]
      // updatedChoices[questionNumber] = choice
      onSelect(questionNumber, choice)
      // setResults(updatedChoices)
    }

    return (
      <QuestionsContainer>
        {hasVideo && (
          <Column>
            <LiveStreamVideoContainer ref={ref}></LiveStreamVideoContainer>
          </Column>
        )}

        <div>
          <Typography variant={TypographyVariant.H3} color={colors.accent1} margin='0'>
            {i18n.t('votes.questions_list.question', {
              totalQuestions: questions.length ,
              questionIndex: questionIndex + 1,
            })}
          </Typography>

          <QuestionUl>
            {questions && questions.map((question, index) => (
              <QuestionLi key={`question-${index}`} active={index === questionIndex}>
                <QuestionCard
                  onSelectChoice={(selectedValue) => handleChoice(index, selectedValue)}
                  question={question}
                  questionIndex={index}
                  selectedIndex={results[index]}
                />
              </QuestionLi>
            ))}
          </QuestionUl>

          <FlexContainer justify={FlexJustifyContent.SpaceBetween}>
            <Button onClick={handlePrev}>
              {i18n.t('votes.questions_list.back')}
            </Button>

            <Button
              onClick={handleNext}
              positive
              disabled={typeof results[questionIndex] === 'undefined'}
            >
              {lastQuestion? i18n.t('votes.questions_list.finish_voting'): i18n.t('votes.questions_list.next_question')}
            </Button>
          </FlexContainer>
        </div>
      </QuestionsContainer>
    )
  }
)

const QuestionsContainer = styled.div`
  position: relative;
`

const LiveStreamVideoContainer = styled.div`
  height: 360px;
  width: 100%;
  padding-bottom: 30px;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
`

const QuestionUl = styled.ul`
  list-style: none;
  padding: 0;
  position: relative;
`

const QuestionLi = styled.li<{active: boolean}>`
  position: ${({ active }) => (active ? 'relative' : 'absolute')};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  opacity: ${({ active }) => (active ? 1 : 0)};
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
`
const VideoContainer = styled.div`
  margin: auto;
  max-width: 800px;
  width: 100%;
`

