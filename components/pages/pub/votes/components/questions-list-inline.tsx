import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react'
import { Choice, Question } from '@lib/types'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { useTranslation } from 'react-i18next'
import { Button, JustifyContent } from '@components/elements/button'
import styled, { useTheme } from 'styled-components'

import { Typography, TypographyVariant, TextAlign } from '@components/elements/typography'
import { SectionText, TextSize } from '@components/elements/text'
import ReactPlayer from 'react-player'
import { Column } from '@components/elements/grid'
import { QuestionCard } from './question-card'
import { colors } from '@theme/colors'
import { Indexed } from '@ethersproject/abi'
import { VoteWeightCard } from './vote-weight-card'
import { If, Then } from 'react-if'

interface IQuesListInlineProps {
  hasVideo?: boolean
  questions: Question[]
  results: number[]
  voteWeight?: string
  onSelect: (questionIndex: number, value: number) => void
  onFinishVote: (results: number[]) => void
  onComponentMounted?: (ref: ForwardedRef<HTMLDivElement>) => void
}

//export const QuestionsListInline = (HTMLDivElement, IQuesListInlineProps) => {
export const QuestionsListInline = forwardRef<HTMLDivElement, IQuesListInlineProps>(
  (
    {
      questions,
      results,
      voteWeight,
      onSelect,
      onFinishVote,
      onComponentMounted
    }: IQuesListInlineProps,
    ref
  ) => {
    const { accent1 } = useTheme()
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

        <div id='voteNow'>          
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
                      number={index+1}
                    />
                  </QuestionLi>
              )
            )}
          </QuestionUl>
          
          <ButtonsActionContainer justify={FlexJustifyContent.Center}>            
            <Button
              onClick={finishVote}
              positive
              disabled={(results.length < questions?.length || results.includes(undefined))}
              large
            >
              {i18n.t('votes.questions_list.finish_voting')}
            </Button>
          </ButtonsActionContainer>

          <If condition={(results.length < questions?.length || results.includes(undefined) && false)}>
            <Typography margin='20px 0px' align={TextAlign.Center} color='#888' variant={TypographyVariant.ExtraSmall}>Has de contestar totes les votacions per poder finalitzar el procés. N'has respost {results.filter(x => x !== undefined).length} de {questions?.length}.</Typography>            
          </If>
        </div>

        <FixedButtonsActionContainer>
          <div>
            <Button
              onClick={finishVote}
              positive
              disabled={(results.length < questions?.length || results.includes(undefined))}
              large
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
    max-width: 430px;
    display: flex;
    justify-content: center;
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
  line-height: 25px;
  display:flex;
  flex-direction: row;
  flex-wrap: wrap;
`

const QuestionLi = styled.li<{ active: boolean }>`
  width: 100%;
`

const QuestionLiTwoColumns = styled.li<{ active: boolean }>`
  margin-top:20px;
  width:48%;
  margin-right:1%;

  @media ${({ theme }) => theme.screenMax.tabletL} {
    width:100%;
    margin-right:0%;
  }

  & > div {
    min-height: 135px;

    @media ${({ theme }) => theme.screenMax.tabletL} {
      min-height: auto;
    }
  }
`

const Separator = styled.div`
  margin:0px;
  width:100%;
`

const SubBanner = styled.div`
  color: #4ac6bf;
  text-align: left;
`
const H1WithPaddingTop = styled.h1`
  padding-top:120px;
  clear:both;
`

const DescriptionUl = styled.ul`
  line-height: 25px;
  list-style: none;
`

const SimpleButton = styled(Button)`
  @media ${({ theme }) => theme.screenMax.mobileL} {
    min-width: 200px !important;
    margin-bottom: 10px !important;
    font-size: 12px !important;
    padding: 10px !important;
    margin-left: 0px !important;
  }
`

const HoritzontalSpace = styled.div`
  display:inline;
  margin-left: 10px;
`

const ButtonText = styled.p`
  color: #fff;
  font-size: 18px;
  font-weight: 500;
  margin: 0 20px;
`