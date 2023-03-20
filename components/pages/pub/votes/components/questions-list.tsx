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
import { Col, Row } from '@components/elements-v2'
import { SectionText, TextSize } from '@components/elements/text'

interface IQuesListProps {
  hasVideo: boolean
  videoUrl?: string
  questions: Question[]
  results: number[]
  voteWeight?: string
  onSelect: (questionIndex: number, value: number) => void
  onFinishVote: (results: number[]) => void
  onBackDescription: () => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}

export const QuestionsList = (props: IQuesListProps) => {
  const [questionIndex, setQuestionIndex] = useState(0)
  const { i18n } = useTranslation()
  const lastQuestion = questionIndex === props.questions?.length - 1

  const handleNext = () => {
    if (questionIndex + 1 < props.questions.length) {
      setQuestionIndex(questionIndex + 1)
      return
    }

    props.onFinishVote(props.results)
  }

  const handlePrev = () => {
    if (questionIndex !== 0) {
      setQuestionIndex(questionIndex - 1)
      return
    }

    props.onBackDescription()
  }

  const handleChoice = (questionNumber: number, choice: number) => {
    props.onSelect(questionNumber, choice)
  }

  return (
    <QuestionsContainer>
      {props.hasVideo && (
          <Col xs={12}>
          {/* INSIDE ROW TO ADJUST GUTTER BETWEEN TITLE AND VIDEO*/}
          <Row gutter='md'>
            <Col xs={12}>
              <SectionText size={TextSize.Big} color={colors.blueText}>
                {i18n.t('vote.live_stream')}
              </SectionText>
            </Col>
            <Col xs={12}>
              <PlayerFixedContainer>
                <PlayerContainer>
                  <ReactPlayer
                    url={props.videoUrl}
                    width="100%"
                    height="100%"
                  />
                </PlayerContainer>
              </PlayerFixedContainer>
            </Col>
          </Row>
        </Col>
        )}
      {props.voteWeight && (
        <WeightedBannerContainer>
          <VoteWeightCard voteWeight={props.voteWeight} />
        </WeightedBannerContainer>
      )}
      <div>
        <Typography
          variant={TypographyVariant.H3}
          color={colors.accent1}
          margin="0"
        >
          {i18n.t('votes.questions_list.question', {
            totalQuestions: props.questions?.length,
            questionIndex: questionIndex + 1,
          })}
        </Typography>

        <QuestionUl>
          {props.questions &&
            props.questions.map((question, index) => (
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
                  selectedIndex={props.results[index]}
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
            disabled={typeof props.results[questionIndex] === 'undefined'}
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
            disabled={typeof props.results[questionIndex] === 'undefined'}
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

const PlayerFixedContainer = styled.div`
  z-index: 30;
  transition: all 0.4s ease-in-out;
  top: 0px;
  height: 360px;
  @media ${({ theme }) => theme.screenMax.tabletL} {
    height: 300px;
  }
  @media ${({ theme }) => theme.screenMax.mobileL} {
    height: 160px;
  }
  width: 100%;
`

const PlayerContainer = styled.div`
  width: 100%;
  height: 100%;
  border-radius: 10px;
  overflow: hidden;
  margin: 0 auto;
`
