import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react'
import { Choice, Question } from '@lib/types'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/elements/button'
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
      onComponentMounted,
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

    const selectCandidaturaA = () => {
      for(let i=5;i<18;i++){
        onSelect(i,0)
      }
    }

    const selectBlanc = () => {
      for(let i=5;i<18;i++){
        onSelect(i,1)
      }
    }

    const selectAbstencio = () => {
      for(let i=5;i<18;i++){
        onSelect(i,2)
      }
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
            <SubBanner>
              <h1>Votacions de l’Assemblea General Ordinaria</h1>
            </SubBanner>

            <br />
          </Column>

          <QuestionUl>
            {questions &&
              questions.map((question, index) => (
                <If condition={index < 5}>
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
                </If>              
              )
            )}
            
            <SubBanner>                  
              <H1WithPaddingTop>Votacions de l’elecció de membes de l’Executiva </H1WithPaddingTop>                    
            </SubBanner>

            <Separator>&nbsp;</Separator>

            <Button onClick={selectCandidaturaA} positive large>Tota la candidatura A</Button>
            <HoritzontalSpace />
            <Button onClick={selectBlanc} positive large>Tot en Blanc</Button>
            <HoritzontalSpace />
            <Button onClick={selectAbstencio} positive large>Tot amb Abstenció</Button>

            <Separator>&nbsp;</Separator>

            {questions &&
              questions.map((question, index) => (
                <If condition={index>=5 && index<18}>
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
                </If>
              )
            )}

            <SubBanner>                  
              <H1WithPaddingTop>Votacions de l’Assemblea General Extraordiària</H1WithPaddingTop>                    
            </SubBanner>

            <Separator>&nbsp;</Separator>

            {questions &&
              questions.map((question, index) => (
                <If condition={index>=18}>
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
                </If>
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

          <If condition={(results.length < questions?.length || results.includes(undefined))}>
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
  margin-top:20px;
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
  color: #F4D500;
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

const SimpleButton = styled.button`
  margin-left: 10px;
`

const HoritzontalSpace = styled.div`
  display:inline;
  margin-left: 10px;
`