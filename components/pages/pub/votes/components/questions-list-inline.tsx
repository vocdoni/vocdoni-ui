import React, { forwardRef, ForwardedRef, useEffect, useState } from 'react'
import { Choice, Question } from '@lib/types'
import { FlexContainer, FlexJustifyContent } from '@components/elements/flex'
import { useTranslation } from 'react-i18next'
import { Button } from '@components/elements/button'
import styled, { useTheme } from 'styled-components'

import { Typography, TypographyVariant } from '@components/elements/typography'
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

    return (
      <QuestionsContainer>
        {voteWeight && (
          <WeightedBannerContainer>
            <VoteWeightCard voteWeight={voteWeight} />
          </WeightedBannerContainer>
        )}

        <div>
          <Column>
            <Typography color='#434548' variant={TypographyVariant.Small}>
              <p>A continuació hi ha les votacions en què han de participar els socis amb dret a vot, és a dir, els socis majors d’edat i al corrent de pagament.</p> 
              <p>Hi trobareu dos apartats: un primer apartat sobre les eleccions a la Junta Directiva i un segon apartat sobre documents que també se sotmeten a votació.</p>
              <p>Per poder emetre correctament els vostres vots cal que respongueu totes les votacions i cliqueu el botó “Finalitzar la votació” que trobareu al final d’aquesta pàgina.</p>              
            </Typography>

            <Separator>&nbsp;</Separator>
            <Separator>&nbsp;</Separator>

            <SubBanner>                  
              <h1>Eleccions a la Junta Directiva</h1>              
            </SubBanner>

            <Typography color='#434548' variant={TypographyVariant.Small}>
              <p>S’ha presentat una sola candidatura per a les eleccions a la Junta Directiva, conformada per 16 persones. Les votacions es fan pel sistema de llistes obertes, és a dir, cal indicar el sentit de la votació persona a persona.</p>
              <p>La informació de la candidatura està disponible al correu electrònic i a través del botó de documentació que podeu trobar més amunt.</p>
            </Typography>
          </Column>

          <QuestionUl>
            {questions &&
              questions.map((question, index) => (
                <If condition={index < 16}>
                  <QuestionLiTwoColumns
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
                  </QuestionLiTwoColumns>
                </If>              
              )
            )}

            {questions &&
              questions.map((question, index) => (
                <If condition={index == 16}>
                  <SubBanner>                  
                    <H1WithPaddingTop>Votació de documents</H1WithPaddingTop>
                    <Typography color='#434548' variant={TypographyVariant.Small}>
                      <p>Tot seguit podeu pronunciar-vos sobre diversos documents que es porten a consideració de l’Assemblea General: l’acta de l’Assemblea General anterior, la proposta de Pla de treball 2022 i la proposta de Pressupost 2022. Tota la documentació està disponible al correu electrònic i a través del botó de documentació que podeu trobar més amunt.</p>
                      <p>Un cop completat, recordeu prémer el botó “Finalitzar la votació” que es troba al final d’aquesta pàgina i confirmeu l’elecció.</p>
                    </Typography>
                  </SubBanner>
                </If>
              )
            )}

            <Separator>&nbsp;</Separator>

            {questions &&
              questions.map((question, index) => (
                <If condition={index>=16}>
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
  color: #FF6320;
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