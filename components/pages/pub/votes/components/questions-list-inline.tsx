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
  hasVideo: boolean
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

            <Separator>&nbsp;</Separator>
            <Separator>&nbsp;</Separator>
            <Separator>&nbsp;</Separator>

            <Typography>
              A continuació hi ha un total de 22 preguntes. Per poder emetre el vostre vot cal que les respongueu totes tot seleccionant una resposta, d’entre les possibles de cada pregunta. Per emetre el votre vot cal que premeu el botó “Envia el teu vot” que hi ha al final d’aquesta pàgina a l’esquerra i que confirmeu aquesta acció a la finestra emergent que us apereixarà a continuació. El vostre vot només serà emès correctament si feu totes aquestes passes amb l’odre indicat, és a dir: 
              <QuestionUl>
                <li>1) respondre totes les preguntes,</li>
                <li>2) prémer el botó “Envia el teu vot” i</li>
                <li>3) confirmar l’enviament del vot a la finestra emergent.</li>
              </QuestionUl>
            </Typography>

            <Separator>&nbsp;</Separator>
            <Separator>&nbsp;</Separator>

            <SubBanner>                  
              <h1>Eleccions a la Junta Nacional</h1>              
            </SubBanner>

            <Typography>
              A continuació hi ha un total de 18 preguntes, una per cada càrrec de la Junta que es posa a votació. Per poder emetre el vostre vot, cal que les respongeu totes tot seleccionant una resposta, d'entre les possibles de cada pregunta.
            </Typography>
          </Column>

          <QuestionUl>
            {questions &&
              questions.map((question, index) => (
                <If condition={index < 18}>
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
                <If condition={index == 18}>
                  <SubBanner>                  
                    <H1WithPaddingTop>Preguntes Assamblea</H1WithPaddingTop>
                    <Typography>
                      A continuació hi ha un total de 4 preguntes, una per punt de l'Assemblea que es posa a votació. Per poder emetre el vostre vot cal que les respongueu totes seleccionant una respota, d'entre les possibles de cada apregunta. Un cop hàgiu acabat la tria, recordeu que cal que emeteu el vostre vot prement el botó "Envia el meu vot" i confirmant-ne l'emissió a la finestra emergent un cop hàgiu comprovat que les opcions mostrades corresponen a les que desitjeu.
                    </Typography>
                  </SubBanner>
                </If>
              )
            )}

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

const QuestionLiTwoColumns = styled.li<{ active: boolean }>`
  margin-top:20px;
  width:48%;
  float:left;
  margin-right:1%;
`

const Separator = styled.div`
  margin:0px;
  width:100%;
`

const SubBanner = styled.div`
  color: #FF6320;
  text-align: justify;
`
const H1WithPaddingTop = styled.h1`
  padding-top:120px;
  clear:both;
`