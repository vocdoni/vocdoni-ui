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
import { If } from 'react-if'

import { TextAlign } from '@components/elements/typography'

interface IQuesListInlineProps {
  questions: Question[]
  results: number[]
  voteWeight?: string
  onSelect: (questionIndex: number, value: number) => void
  onFinishVote: (results: number[]) => void
  onBackDescription: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}

export const QuestionsListInline = forwardRef<HTMLDivElement, IQuesListInlineProps>((props: IQuesListInlineProps, ref) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const { i18n } = useTranslation()
  const lastQuestion = questionIndex === props.questions?.length - 1

  const handleSubmit = () => {  
    props.onFinishVote(props.results)
  }

  const handleChoice = (questionNumber: number, choice: number) => {
    props.onSelect(questionNumber, choice)
  }

  return (
    <QuestionsContainer>
      {props.voteWeight && (
        <WeightedBannerContainer>
          <VoteWeightCard voteWeight={props.voteWeight} />
        </WeightedBannerContainer>
      )}

      <div ref={ref}>
        <QuestionUl>
          {props.questions &&
            props.questions.map((question, index) => (
              <QuestionLi
                key={`question-${index}`}
              >
                <QuestionCard
                  onSelectChoice={(selectedValue) =>
                    handleChoice(index, selectedValue)
                  }
                  question={question}
                  questionIndex={index}
                  selectedIndex={props.results[index]}
                />
              </QuestionLi>
            ))}
        </QuestionUl>

        <ButtonsActionContainer justify={FlexJustifyContent.Center}>
          <Button
            onClick={handleSubmit}
            positive
            disabled={(props.results.length < props.questions?.length || props.results.includes(undefined))}
          >
            {i18n.t('votes.questions_list.finish_voting')}
          </Button>
        </ButtonsActionContainer>

        <If condition={(props.results.length < props.questions?.length || props.results.includes(undefined))}>
          <Typography margin='20px 0px' align={TextAlign.Center} color='#888' variant={TypographyVariant.ExtraSmall}>
            {i18n.t('votes.questions_list.num_questions_info')} {props.results.filter(x => x !== undefined).length} {i18n.t('votes.questions_list.num_questions_total', {numTotal: props.questions?.length})}.
          </Typography>            
        </If>
      </div>

      <FixedButtonsActionContainer>
        <div>  
          <Button
            onClick={handleSubmit}
            positive
            disabled={(props.results.length < props.questions?.length || props.results.includes(undefined))}
          >
            {i18n.t('votes.questions_list.finish_voting')}
          </Button>
        </div>
      </FixedButtonsActionContainer>

      <br /><br /><br />
    </QuestionsContainer>
  )
})

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

const QuestionLi = styled.li`
  position: relative;
  visibility: visible;
  margin-top: 15px;
`