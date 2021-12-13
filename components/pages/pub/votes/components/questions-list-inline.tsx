import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react'
import { Choice, Question } from '@lib/types'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/elements/button'
import styled from 'styled-components'

import { Typography, TypographyVariant } from '@components/elements/typography'
import { SectionText, TextSize } from '@components/elements/text'
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
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}

export const QuestionsListInline = forwardRef<HTMLDivElement, IQuesListProps>(
  (
    {
      questions,
      results,
      voteWeight,
      onSelect,
      onFinishVote,
      onComponentMounted,
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

    const finishVote = () => {
      onFinishVote(results)
    }

    const handleChoice = (questionNumber: number, choice: number) => {
      onSelect(questionNumber, choice)
    }

    return (
      <QuestionsContainer>
        {voteWeight && (
          <WeightedBannerContainer>
            <VoteWeightCard voteWeight={voteWeight} />
          </WeightedBannerContainer>
        )}
        <div>
          <Column>
            <SectionText size={TextSize.Big} color={colors.blueText}>
              {i18n.t('vote.questions')}
            </SectionText>
          </Column>

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
                  />
                </QuestionLi>
              ))}
          </QuestionUl>

          <ButtonsActionContainer justify={FlexJustifyContent.Center}>
            <Button
              onClick={finishVote}
              positive
              disabled={(results.length < questions.length || results.includes(undefined))}
            >
              {i18n.t('votes.questions_list.finish_voting')}
            </Button>
          </ButtonsActionContainer>
        </div>

        <FixedButtonsActionContainer>
          <div>
            <Button
              onClick={finishVote}
              positive
              disabled={(results.length < questions.length || results.includes(undefined))}
            >
              {i18n.t('votes.questions_list.finish_voting')}
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
  margin-top: 20px;
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
  margin-top:20px;
`
