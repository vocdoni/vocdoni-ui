import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react'
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
import { VoteWeightCard } from './vote-weight-card'

interface IQuesListProps {
  hasVideo: boolean
  questions: Question[]
  results: number[]
  voteWeight?: string
  onSelect: (questionIndex: number, value: number) => void
  onFinishVote: (results: number[]) => void
  onBackDescription: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
  randomAnswersOrder: boolean
}

export const QuestionsList = forwardRef<HTMLDivElement, IQuesListProps>(
  (
    {
      hasVideo,
      questions,
      results,
      voteWeight,
      onSelect,
      onFinishVote,
      onBackDescription,
      onComponentMounted,
      randomAnswersOrder,
    }: IQuesListProps,
    ref
  ) => {
    useEffect(() => {
      onComponentMounted && onComponentMounted(ref)
    }, [])

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
      onSelect(questionNumber, choice)
    }

    return (
      <QuestionsContainer>
        {hasVideo && (
          <LiveStreamVideoContainer ref={ref}></LiveStreamVideoContainer>
        )}
        {voteWeight && (
          <WeightedBannerContainer>
            <VoteWeightCard voteWeight={voteWeight} />
          </WeightedBannerContainer>
        )}
        <div>
          <Typography
            variant={TypographyVariant.H3}
            color={colors.accent1}
            margin="0"
          >
            {i18n.t('votes.questions_list.question', {
              totalQuestions: questions?.length,
              questionIndex: questionIndex + 1,
            })}
          </Typography>

          <QuestionUl>
            {questions &&
              questions.map((question, index) => (
                <QuestionLi
                  key={`question-${index}`}
                  active={index === questionIndex}
                >
                  <QuestionCard
                    onSelectChoice={(selectedValue) =>
                      handleChoice(index, selectedValue)
                    }
                    question={question}
                    questionIndex={index}
                    selectedIndex={results[index]}
                    randomAnswersOrder={randomAnswersOrder}
                  />
                </QuestionLi>
              ))}
          </QuestionUl>

          <ButtonsActionContainer justify={FlexJustifyContent.SpaceBetween}>
            <Button onClick={handlePrev}>
              {i18n.t('votes.questions_list.back')}
            </Button>

            <Button
              onClick={handleNext}
              positive
              disabled={typeof results[questionIndex] === 'undefined'}
            >
              {lastQuestion
                ? i18n.t('votes.questions_list.finish_voting')
                : i18n.t('votes.questions_list.next_question')}
            </Button>
          </ButtonsActionContainer>
        </div>

        <FixedButtonsActionContainer>
          <div>
            <Button onClick={handlePrev}>
              {i18n.t('votes.questions_list.back')}
            </Button>

            <Button
              onClick={handleNext}
              positive
              disabled={typeof results[questionIndex] === 'undefined'}
            >
              {lastQuestion
                ? i18n.t('votes.questions_list.finish_voting')
                : i18n.t('votes.questions_list.next_question')}
            </Button>
          </div>
        </FixedButtonsActionContainer>
      </QuestionsContainer>
    )
  }
)

const WeightedBannerContainer = styled.div`
  margin: 30px 0 40px 0;
`

const ButtonsActionContainer = styled(FlexContainer)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    display: none;
  }
`

const FixedButtonsActionContainer = styled.div`
  position: fixed;
  display: none;
  justify-content: space-between;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 30;
  background-color: ${({ theme }) => theme.white};
  padding: 28px 10px;
  box-shadow: 1px 1px 9px #8f8f8f;

  & > div {
    margin: 0 auto;
    max-width: 330px;
    display: flex;
    justify-content: space-between;

    & > * {
      width: 48%;
    }
  }

  @media ${({ theme }) => theme.screenMax.mobileL} {
    display: block;
  }
`

const QuestionsContainer = styled.div`
  position: relative;
`

const LiveStreamVideoContainer = styled.div`
  height: 360px;
  width: 100%;
  margin-bottom: 30px;

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
  padding-bottom: 12px;
`

const QuestionLi = styled.li<{ active: boolean }>`
  position: ${({ active }) => (active ? 'relative' : 'absolute')};
  visibility: ${({ active }) => (active ? 'visible' : 'hidden')};
  opacity: ${({ active }) => (active ? 1 : 0)};
  top: 0;
  left: 0;
  right: 0;
  transition: all 0.3s ease-in-out;
`
